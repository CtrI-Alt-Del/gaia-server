import { Measurement } from '@/core/telemetry/domain/entities/measurement'
import { MeasurementDto } from '@/core/telemetry/domain/dtos/measurement-dto'

import { PrismaMeasure } from '../types/prisma-measure'

export class PrismaMeasurementMapper {
  static toEntity(measurement: PrismaMeasure): Measurement {
    return Measurement.create(PrismaMeasurementMapper.toDto(measurement))
  }

  static toDto(measurement: PrismaMeasure): MeasurementDto {
    return {
      value: measurement.value,
      createdAt: measurement.createdAt,
      parameter: {
        id: measurement.stationParameter.parameter.id,
        entity: {
          name: measurement.stationParameter.parameter.name,
          unitOfMeasure: measurement.stationParameter.parameter.unitOfMeasure,
          stationId: measurement.stationParameter.station.id,
          stationName: measurement.stationParameter.station.name,
        },
      },
    }
  }
}
