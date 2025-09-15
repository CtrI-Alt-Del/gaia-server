import { Injectable } from '@nestjs/common'

import type { ParametersRepository } from '@/core/global/interfaces'
import { Id } from '@/core/global/domain/structures'
import { Parameter } from '@/core/telemetry/entities/parameter'
import { PrismaParameterMapper } from '@/infra/database/prisma/mappers'
import { ParametersListParams } from '@/core/global/types'
import { PrismaRepository } from './prisma-repository'

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

  async findMany(params: ParametersListParams): Promise<Parameter[]> {
    throw new Error('Method not implemented.')
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
