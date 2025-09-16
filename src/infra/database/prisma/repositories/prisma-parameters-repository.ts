import { Injectable } from '@nestjs/common'

import type { ParametersRepository } from '@/core/global/interfaces'
import { CursorPagination, Id } from '@/core/global/domain/structures'
import { PrismaParameterMapper } from '@/infra/database/prisma/mappers'
import { ParametersListParams } from '@/core/global/types'
import { PrismaRepository } from './prisma-repository'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'

@Injectable()
export class PrismaParametersRepository
  extends PrismaRepository
  implements ParametersRepository
{
  async add(parameter: Parameter): Promise<void> {
    const prismaParameter = PrismaParameterMapper.toPrisma(parameter)
    await this.prisma.parameter.create({ data: prismaParameter })
  }

  async findById(id: Id): Promise<Parameter | null> {
    const prismaParameter = await this.prisma.parameter.findUnique({
      where: { id: id.value },
    })

    if (!prismaParameter) {
      return null
    }

    return PrismaParameterMapper.toEntity(prismaParameter)
  }

  async findMany({
    nextCursor,
    previousCursor,
    pageSize,
    isActive,
  }: ParametersListParams): Promise<CursorPagination<Parameter>> {
    let parameters: any[]
    let hasPreviousPage = false
    let hasNextPage = false

    if (nextCursor) {
      parameters = await this.prisma.parameter.findMany({
        ...this.getNextCursorPaginationParams(nextCursor, pageSize),
        where: { isActive: isActive?.isTrue },
      })
      const result = this.getNextCursorPaginationResult(parameters, pageSize)
      parameters = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    } else if (previousCursor) {
      parameters = await this.prisma.parameter.findMany({
        ...this.getPreviousCursorPaginationParams(previousCursor, pageSize),
        where: { isActive: isActive?.isTrue },
      })
      const result = this.getPreviousCursorPaginationResult(parameters, pageSize)
      parameters = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    } else {
      parameters = await this.prisma.parameter.findMany({
        ...this.getInitialPaginationParams(pageSize),
        where: { isActive: isActive?.isTrue },
      })
      const result = this.getInitialPaginationResult(parameters, pageSize)
      parameters = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    }

    const newNextCursor = this.getNewNextCursor(parameters, hasNextPage)
    const newPrevCursor = this.getNewPreviousCursor(parameters)

    return CursorPagination.create({
      items: parameters.map(PrismaParameterMapper.toEntity),
      pageSize: pageSize.value,
      nextCursor: newNextCursor,
      previousCursor: newPrevCursor,
      hasNextPage,
      hasPreviousPage,
    })
  }

  async replace(parameter: Parameter): Promise<void> {
    const prismaParameter = PrismaParameterMapper.toPrisma(parameter)
    await this.prisma.parameter.update({
      where: { id: prismaParameter.id },
      data: prismaParameter,
    })
  }

  async deleteById(id: Id): Promise<void> {
    await this.prisma.parameter.delete({ where: { id: id.value } })
  }
}
