import { Numeric, Text, Timestamp } from '@/core/global/domain/structures'

import { MeasurementDto } from '../dtos/measurement-dto'
import { Parameter } from './parameter'
import { Station } from './station'
import { Entity } from '@/core/global/domain/abstracts'

type MeasurementProps = {
  stationParameter: {
    stationId: Text
    parameterId: Text
  }
  unitOfMeasure: Text
  value: Numeric
  createdAt: Timestamp
}

export class Measurement extends Entity<MeasurementProps> {
  static create(dto: MeasurementDto): Measurement{
    return new Measurement(
      {
        stationParameter: {
          stationId: Text.create(dto.stationParameter.stationId),
          parameterId: Text.create(dto.stationParameter.parameterId)
        },
        unitOfMeasure: Text.create(dto.unitOfMeasure),
        value: Numeric.create(dto.value),
        createdAt: Timestamp.create(dto.createdAt)
      }
    )
  }

  get unitOfMeasure(): Text{
    return this.props.unitOfMeasure
  }

  get value(): Numeric {
    return this.props.value
  }

  get createdAt(): Timestamp{
    return this.props.createdAt
  }

  get stationParameter(): {stationId: Text, parameterId: Text}{
    return this.props.stationParameter
  }

  get dto(): MeasurementDto{
    return {
      id: this.id.value,
      stationParameter: {
        parameterId: this.stationParameter.parameterId.value,
        stationId: this.stationParameter.stationId.value
      },
      unitOfMeasure: this.unitOfMeasure.value,
      value: this.value.value,
      createdAt: this.createdAt.value
    }
  }
}
