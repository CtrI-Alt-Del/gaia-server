
import { Injectable } from '@nestjs/common'

import { Prisma } from '../client'
import type { ParametersRepository } from '@/core/global/interfaces'
import { Id } from '@/core/global/domain/structures'
import { Parameter } from '@/core/telemetry/entities/parameter'
import { PrismaParameterMapper } from '@/infra/database/prisma/mappers'
import { ParametersListParams } from '@/core/global/types'

@Injectable()
export class PrismaParametersRepository implements ParametersRepository {
  constructor(
    private readonly prisma: Prisma,
    private readonly mapper: PrismaParameterMapper,
  ) {}
  async add(parameter: Parameter): Promise<void> {
    const prismaParameter = this.mapper.toPrisma(parameter)
    await this.prisma.parameter.create({ data: prismaParameter })
  }
  async findById(id: Id): Promise<Parameter | null> {
    const prismaParameter = await this.prisma.parameter.findUnique({
      where: { id: id.value },
    })
    if (!prismaParameter) {
      // @TODO: adiccioanr excecao especfica
      throw new Error('Parameter not found')
    }
    return this.mapper.toEntity(prismaParameter)
  }
  async findMany(params: ParametersListParams): Promise<Parameter[]> {
    throw new Error('Method not implemented.')
  }
  update(parameter: Parameter): Promise<void> {
    throw new Error('Method not implemented.')
  }
  deleteById(id: Id): Promise<void> {
}
}
