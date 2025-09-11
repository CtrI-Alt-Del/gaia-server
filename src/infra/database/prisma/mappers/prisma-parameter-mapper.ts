
import { Injectable } from '@nestjs/common'
import type { PrismaParameter } from '../types'
import { Parameter } from '@/core/telemetry/entities/parameter'

@Injectable()
export class PrismaParameterMapper {
  toEntity(prismaParameter: PrismaParameter): Parameter {
    const entity = Parameter.create({
      id: prismaParameter.id,
      name: prismaParameter.name,
      unitOfMeasure: prismaParameter.unitOfMeasure,
      numberOfDecimalPlaces: prismaParameter.numberOfDecimalPlaces,
      factor: prismaParameter.factor,
      offset: prismaParameter.offset,
    })

    return entity
  }

  toPrisma(parameter: Parameter): PrismaParameter {
    return {
      id: parameter.id.value,
      name: parameter.name.value,
      unitOfMeasure: parameter.unitOfMeasure.value,
      numberOfDecimalPlaces: parameter.numberOfDecimalPlaces.value,
      factor: parameter.factor.value,
      offset: parameter.offset.value,
      isActive: parameter.isActive.value,
      createdAt: parameter.createdAt,
      updatedAt: parameter.updatedAt,
    }
  }
