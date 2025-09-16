import type Prisma from '@prisma/client'

import type { PrismaParameter } from '../types'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'

export class PrismaParameterMapper {
  static toEntity(prismaParameter: Prisma.Parameter): Parameter {
    return Parameter.create({
      id: prismaParameter.id,
      name: prismaParameter.name,
      unitOfMeasure: prismaParameter.unitOfMeasure,
      factor: prismaParameter.factor,
      offset: prismaParameter.offset,
      isActive: prismaParameter.isActive,
      createdAt: prismaParameter.createdAt,
      updatedAt: prismaParameter.updatedAt,
    })
  }

  static toPrisma(parameter: Parameter): PrismaParameter {
    return {
      id: parameter.id.value,
      name: parameter.name.value,
      unitOfMeasure: parameter.unitOfMeasure.value,
      factor: parameter.factor.value,
      offset: parameter.offset.value,
      isActive: parameter.isActive.value,
      createdAt: parameter.createdAt.value,
      updatedAt: parameter.updatedAt?.value,
    }
  }
}
