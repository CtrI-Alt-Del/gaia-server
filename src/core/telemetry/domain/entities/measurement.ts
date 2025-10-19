import { Numeric, Text, Timestamp } from '@/core/global/domain/structures'

import { MeasurementDto } from '../dtos/measurement-dto'
import { Entity } from '@/core/global/domain/abstracts'

type MeasurementProps = {
  stationId: Text
  parameterId: Text
  stationName: Text
  parameterName: Text
  unitOfMeasure: Text
  value: Numeric
  createdAt: Timestamp
}

export class Measurement extends Entity<MeasurementProps> {
  static create(dto: MeasurementDto): Measurement {
    return new Measurement({
      stationId: Text.create(dto.stationId),
      parameterId: Text.create(dto.parameterId),
      stationName: Text.create(dto.stationName),
      parameterName: Text.create(dto.parameterName),
      unitOfMeasure: Text.create(dto.unitOfMeasure),
      value: Numeric.create(dto.value),
      createdAt: Timestamp.create(dto.createdAt),
    })
  }

  get unitOfMeasure(): Text {
    return this.props.unitOfMeasure
  }

  get value(): Numeric {
    return this.props.value
  }

  get createdAt(): Timestamp {
    return this.props.createdAt
  }

  get stationId(): Text {
    return this.props.stationId
  }

  get parameterId(): Text {
    return this.props.parameterId
  }

  get stationName(): Text {
    return this.props.stationName
  }

  get parameterName(): Text {
    return this.props.parameterName
  }

  get dto(): MeasurementDto {
    return {
      id: this.id.value,
      stationId: this.stationId.value,
      parameterId: this.parameterId.value,
      stationName: this.stationName.value,
      parameterName: this.parameterName.value,
      unitOfMeasure: this.unitOfMeasure.value,
      value: this.value.value,
      createdAt: this.createdAt.value,
    }
  }
}
