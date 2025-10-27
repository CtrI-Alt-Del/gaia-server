import { Numeric, Timestamp } from '@/core/global/domain/structures'

import { MeasurementDto } from '../dtos/measurement-dto'
import { ParameterAggregate } from '@/core/alerting/domain/aggregates/parameter-aggregate'

export class Measurement {
  private constructor(
    readonly value: Numeric,
    readonly createdAt: Timestamp,
    readonly parameter: ParameterAggregate,
  ) {}

  static create(dto: MeasurementDto): Measurement {
    return new Measurement(
      Numeric.create(dto.value),
      Timestamp.create(dto.createdAt),
      ParameterAggregate.create(dto.parameter),
    )
  }

  get dto(): MeasurementDto {
    return {
      parameter: this.parameter.dto,
      value: this.value.value,
      createdAt: this.createdAt.value,
    }
  }
}
