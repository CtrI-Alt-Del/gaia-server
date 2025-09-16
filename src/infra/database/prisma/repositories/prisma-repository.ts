import { Injectable } from '@nestjs/common'
import { Prisma as PrismaClient } from '../client'
import { Id, PlusInteger } from '@/core/global/domain/structures'

export interface PaginationParams {
  take: number
  skip?: number
  cursor?: { id: string }
  orderBy: Record<string, 'asc' | 'desc'>
}

@Injectable()
export abstract class PrismaRepository {
  constructor(protected readonly prisma: PrismaClient) {}

  protected getNextCursorPaginationParams(
    nextCursor: Id,
    pageSize: PlusInteger,
    orderBy: Record<string, 'asc' | 'desc'> = { id: 'asc' },
  ): PaginationParams {
    return {
      take: pageSize.value + 1,
      skip: 1,
      cursor: { id: nextCursor.value },
      orderBy,
    }
  }

  protected getPreviousCursorPaginationParams(
    previousCursor: Id,
    pageSize: PlusInteger,
    orderBy: Record<string, 'asc' | 'desc'> = { id: 'desc' },
  ): PaginationParams {
    return {
      take: -(pageSize.value + 1),
      skip: 1,
      cursor: { id: previousCursor.value },
      orderBy,
    }
  }

  protected getInitialPaginationParams(
    pageSize: PlusInteger,
    orderBy: Record<string, 'asc' | 'desc'> = { id: 'asc' },
  ): PaginationParams {
    return {
      take: pageSize.value + 1,
      orderBy,
    }
  }

  protected getNextCursorPaginationResult(items: any[], pageSize: PlusInteger) {
    const hasNextPage = items.length > pageSize.value
    const slicedItems = items.slice(0, pageSize.value)
    const hasPreviousPage = true

    return { items: slicedItems, hasNextPage, hasPreviousPage }
  }

  protected getPreviousCursorPaginationResult(items: any[], pageSize: PlusInteger) {
    const reversedItems = items.reverse()
    const hasPreviousPage = items.length > pageSize.value
    const slicedItems = reversedItems.slice(0, pageSize.value)
    const hasNextPage = true

    return { items: slicedItems, hasNextPage, hasPreviousPage }
  }

  protected getInitialPaginationResult(items: any[], pageSize: PlusInteger) {
    const hasNextPage = items.length > pageSize.value
    const slicedItems = items.slice(0, pageSize.value)
    const hasPreviousPage = false

    return { items: slicedItems, hasNextPage, hasPreviousPage }
  }

  protected getNewNextCursor(items: any[], hasNextPage: boolean) {
    return hasNextPage ? items[items.length - 1]?.id : undefined
  }

  protected getNewPreviousCursor(items: any[]) {
    return items.length > 0 ? items[0]?.id : undefined
  }
}
