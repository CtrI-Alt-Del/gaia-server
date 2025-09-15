import { Numeric, Timestamp } from '@/core/global/domain/structures'

import { MeasurementDto } from '../dtos/measurement-dto'
import { Parameter } from '../entities/parameter'
import { Station } from '../entities/station'

export class Measurement {
  private constructor(
    readonly station: Station,
    readonly parameter: Parameter,
    readonly value: Numeric,
    readonly measuredAt: Timestamp,
  ) {}

  static create(dto: MeasurementDto): Measurement {
    return new Measurement(
      Station.create(dto.station),
      Parameter.create(dto.parameter),
      Numeric.create(dto.value),
      Timestamp.create(dto.measuredAt),
    )
  }
}
