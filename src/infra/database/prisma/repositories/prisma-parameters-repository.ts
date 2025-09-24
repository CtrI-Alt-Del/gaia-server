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
    status,
  }: ParametersListParams): Promise<CursorPagination<Parameter>> {
    const whereClause = status?.isAll.isTrue
      ? undefined
      : { isActive: status?.isActive.isTrue }

    const query = this.createPaginationQuery(this.prisma.parameter, whereClause)

    const result = await this.paginateWithCursor<any>(query, {
      nextCursor,
      previousCursor,
      pageSize,
    })

    return result.map(PrismaParameterMapper.toEntity)
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

  async findManyByIds(ids: Id[]): Promise<Parameter[]> {
    const prismaParameters = await this.prisma.parameter.findMany({
      where: { id: { in: ids.map((id) => id.value) }, isActive: true },
    })
    return prismaParameters.map(PrismaParameterMapper.toEntity)
  }

  async findParametersByStationId(stationId: Id): Promise<Parameter[]> {
    const prismaParameters = await this.prisma.parameter.findMany({
      where: {
        stationParameter:{
          some:{
            stationId: stationId.value 
          }
        }
      },
    })
    return prismaParameters.map(PrismaParameterMapper.toEntity)
  }
}
