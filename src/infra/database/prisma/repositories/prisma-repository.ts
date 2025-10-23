import { Injectable } from '@nestjs/common'
import { Prisma as PrismaClient } from '../prisma'
import { CursorPagination, Id, PlusInteger } from '@/core/global/domain/structures'
import { CursorPaginationParams } from '@/core/global/domain/types/cursor-pagination-params'
import { AppError } from '@/core/global/domain/errors'

export interface CursorPaginationQuery {
  model: any
  where?: any
  orderBy?: Record<string, 'asc' | 'desc'>
  select?: any
  include?: any
}

export interface CursorPaginationResult<T> {
  items: T[]
  hasNextPage: boolean
  hasPreviousPage: boolean
  nextCursor?: string
  previousCursor?: string
}

@Injectable()
export abstract class PrismaRepository {
  constructor(protected readonly prisma: PrismaClient) {}

  protected async paginateWithCursor<T>(
    query: CursorPaginationQuery,
    params: CursorPaginationParams,
  ): Promise<CursorPagination<T>> {
    const result = await this.paginate(query, params)
    // @ts-ignore
    return this.toCursorPagination<T>(result, params.pageSize.value)
  }

  protected createPaginationQuery(
    model: any,
    where?: any,
    orderBy: Record<string, 'asc' | 'desc'> = { id: 'desc' },
    select?: any,
    include?: any,
  ): CursorPaginationQuery {
    return {
      model,
      where,
      orderBy,
      select,
      include,
    }
  }

  private async paginate<T>(
    query: CursorPaginationQuery,
    params: CursorPaginationParams,
  ): Promise<CursorPaginationResult<T>> {
    const { model, where, orderBy = { id: 'desc' }, select, include } = query
    const { nextCursor, previousCursor, pageSize } = params

    if (!nextCursor && !previousCursor) {
      return this.handleFirstPage(model, where, orderBy, pageSize, select, include)
    }

    if (nextCursor) {
      return this.handleNextPage(
        model,
        where,
        orderBy,
        pageSize,
        nextCursor,
        select,
        include,
      )
    }

    if (previousCursor) {
      return this.handlePreviousPage(
        model,
        where,
        orderBy,
        pageSize,
        previousCursor,
        select,
        include,
      )
    }

    throw new AppError(
      'Invalid cursor pagination parameters error',
      'Parâmetros de paginação inválidos',
    )
  }

  private async handleFirstPage<T>(
    model: any,
    where: any,
    orderBy: Record<string, 'asc' | 'desc'>,
    pageSize: PlusInteger,
    select?: any,
    include?: any,
  ): Promise<CursorPaginationResult<T>> {
    const items = await model.findMany({
      take: pageSize.value + 1,
      where,
      orderBy,
      select,
      include,
    })

    const hasNextPage = items.length > pageSize.value
    const paginatedItems = items.slice(0, pageSize.value)

    return {
      items: paginatedItems,
      hasNextPage,
      hasPreviousPage: false,
      nextCursor: hasNextPage
        ? this.extractId(paginatedItems[paginatedItems.length - 1])
        : undefined,
      previousCursor: undefined,
    }
  }

  private async handleNextPage<T>(
    model: any,
    where: any,
    orderBy: Record<string, 'asc' | 'desc'>,
    pageSize: PlusInteger,
    nextCursor: Id,
    select?: any,
    include?: any,
  ): Promise<CursorPaginationResult<T>> {
    const items = await model.findMany({
      take: pageSize.value + 1,
      skip: 1,
      cursor: { id: nextCursor.value },
      where,
      orderBy,
      select,
      include,
    })

    const hasNextPage = items.length > pageSize.value
    const paginatedItems = items.slice(0, pageSize.value)

    return {
      items: paginatedItems,
      hasNextPage,
      hasPreviousPage: true,
      nextCursor: hasNextPage
        ? this.extractId(paginatedItems[paginatedItems.length - 1])
        : undefined,
      previousCursor: this.extractId(paginatedItems[0]),
    }
  }

  private async handlePreviousPage<T>(
    model: any,
    where: any,
    orderBy: Record<string, 'asc' | 'desc'>,
    pageSize: PlusInteger,
    previousCursor: Id,
    select?: any,
    include?: any,
  ): Promise<CursorPaginationResult<T>> {
    const isDescending = Object.values(orderBy).some((direction) => direction === 'desc')

    if (isDescending) {
      const items = await model.findMany({
        take: pageSize.value + 1,
        where: {
          ...where,
          id: { gte: previousCursor.value },
        },
        orderBy: { id: 'asc' },
        select,
        include,
      })

      if (items.length === 0) {
        return this.handleFirstPage(model, where, orderBy, pageSize, select, include)
      }

      const reversedItems = items.reverse()

      const startIndex = reversedItems[0]?.id === previousCursor.value ? 1 : 0
      const paginatedItems = reversedItems.slice(startIndex, startIndex + pageSize.value)

      const firstItemId = paginatedItems[0]?.id
      const hasPreviousPage = firstItemId
        ? await this.hasMoreRecordsAfter(model, firstItemId, where)
        : false

      return {
        items: paginatedItems,
        hasNextPage: true,
        hasPreviousPage,
        nextCursor: this.extractId(paginatedItems[paginatedItems.length - 1]),
        previousCursor: hasPreviousPage ? this.extractId(paginatedItems[0]) : undefined,
      }
    } else {
      const reversedOrderBy = this.reverseOrderBy(orderBy)
      const items = await model.findMany({
        take: pageSize.value + 1,
        cursor: { id: previousCursor.value },
        where: {
          ...where,
          id: { lte: previousCursor.value },
        },
        orderBy: reversedOrderBy,
        select,
        include,
      })

      const reversedItems = items.reverse()
      const firstItemId = reversedItems[0]?.id
      const hasPreviousPage = firstItemId
        ? await this.hasMoreRecordsBefore(model, firstItemId, where)
        : false

      const paginatedItems = reversedItems.slice(0, pageSize.value)

      return {
        items: paginatedItems,
        hasNextPage: true,
        hasPreviousPage,
        nextCursor: this.extractId(paginatedItems[paginatedItems.length - 1]),
        previousCursor: hasPreviousPage ? this.extractId(paginatedItems[0]) : undefined,
      }
    }
  }

  private reverseOrderBy(
    orderBy: Record<string, 'asc' | 'desc'>,
  ): Record<string, 'asc' | 'desc'> {
    const reversed: Record<string, 'asc' | 'desc'> = {}
    for (const [field, direction] of Object.entries(orderBy)) {
      reversed[field] = direction === 'asc' ? 'desc' : 'asc'
    }
    return reversed
  }

  private async hasMoreRecordsBefore(
    model: any,
    beforeId: string,
    where?: any,
  ): Promise<boolean> {
    const count = await model.count({
      where: {
        ...where,
        id: { lt: beforeId },
      },
    })
    return count > 0
  }

  private async hasMoreRecordsAfter(
    model: any,
    afterId: string,
    where?: any,
  ): Promise<boolean> {
    const count = await model.count({
      where: {
        ...where,
        id: { gt: afterId },
      },
    })
    return count > 0
  }

  private extractId(item: any): string | undefined {
    return item?.id
  }

  private toCursorPagination<T>(
    result: CursorPaginationResult<T>,
    pageSize: number,
  ): CursorPagination<T> {
    return CursorPagination.create({
      items: result.items,
      pageSize,
      nextCursor: result.nextCursor ?? null,
      previousCursor: result.previousCursor ?? null,
      hasNextPage: result.hasNextPage,
      hasPreviousPage: result.hasPreviousPage,
    })
  }
}
