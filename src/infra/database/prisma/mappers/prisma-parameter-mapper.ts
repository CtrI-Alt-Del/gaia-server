import type Prisma from '@prisma/client'

import type { PrismaParameter } from '../types'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'

export class PrismaParameterMapper {
  static toEntity(prismaParameter: Prisma.Parameter): Parameter {
    return Parameter.create(PrismaParameterMapper.toDto(prismaParameter))
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
  static toDto(parameter: Prisma.Parameter): ParameterDto {
    return {
      id: parameter.id,
      name: parameter.name,
      unitOfMeasure: parameter.unitOfMeasure,
      factor: parameter.factor,
      offset: parameter.offset,
      isActive: parameter.isActive,
      createdAt: parameter.createdAt,
      updatedAt: parameter.updatedAt,
    }
  }
}
