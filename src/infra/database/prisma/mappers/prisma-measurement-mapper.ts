import { Measurement } from '@/core/telemetry/domain/entities/measurement'
import { PrismaMeasure } from '../types/prisma-measure'
import { MeasurementDto } from '@/core/telemetry/domain/dtos/measurement-dto'
import type Prisma from '@prisma/client'
import { Id } from '@/core/global/domain/structures'

export class PrismaMeasurementMapper {
  static toEntity(measurement: PrismaMeasure): Measurement {
    return Measurement.create(PrismaMeasurementMapper.toDto(measurement))
  }

  static toPrisma(measurement: Measurement, stationParameterId?: Id): Prisma.Measure {
    return {
      id: measurement.id.value,
      value: measurement.value.value,
      unitOfMeasure: measurement.unitOfMeasure.value,
      createdAt: measurement.createdAt.value,
      stationParameterId: stationParameterId
        ? stationParameterId.value
        : measurement.parameterId.value,
    }
  }

  static toDto(measurement: PrismaMeasure): MeasurementDto {
    return {
      id: measurement.id,
      value: measurement.value,
      unitOfMeasure: measurement.unitOfMeasure,
      createdAt: measurement.createdAt ? (measurement.createdAt as Date) : new Date(),
      stationId: measurement.stationParameter.station.id,
      parameterId: measurement.stationParameter.parameter.id,
      stationName: measurement.stationParameter.station.name,
      parameterName: measurement.stationParameter.parameter.name,
    }
  }
}
