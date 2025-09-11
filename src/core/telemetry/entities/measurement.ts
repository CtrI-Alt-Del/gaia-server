import { Entity } from '@/core/global/domain/abstracts'
import { Timestamp } from '@/core/global/domain/structures'
import { Integer } from '@/core/global/domain/structures/integer'
import { MeasurementDto } from '@/core/telemetry/dtos/measurement.dto'
import { Parameter } from '@/core/telemetry/entities/parameter'
import { Station } from '@/core/telemetry/entities/station'

type MeasurementProps = {
  station: Station
  parameter: Parameter
  value: Integer
  measuredAt: Timestamp
}
export class Measurement extends Entity<MeasurementProps> {
  static create(dto: MeasurementDto): Measurement {
    return new Measurement(
      {
        station: Station.create(dto.station),
        parameter: Parameter.create(dto.parameter),
        value: Integer.create(dto.value),
        measuredAt: Timestamp.createFromDate(dto.measuredAt),
      },
      dto.id,
    )
  }
  get station(): Station {
    return this.props.station
  }
  get parameter(): Parameter {
    return this.props.parameter
  }
  get value(): Integer {
    return this.props.value
  }
  get measuredAt(): Timestamp {
    return this.props.measuredAt
  }
  get dto(): MeasurementDto {
    return {
      id: this.id.value,
      station: this.station.dto,
      parameter: this.parameter.dto,
      value: this.value.value,
      measuredAt: this.measuredAt.toDate(),
    }
  }
}
