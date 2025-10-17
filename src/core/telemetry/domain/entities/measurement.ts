import { Numeric, Text, Timestamp } from '@/core/global/domain/structures'

import { MeasurementDto } from '../dtos/measurement-dto'
import { Entity } from '@/core/global/domain/abstracts'

type MeasurementProps = {
  stationParameter: {
    id?: Text
    station: {
      id: Text,
      name: Text
    }
    parameter: {
      id: Text,
      name: Text
    }
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
          id: dto.stationParameter.id ? Text.create(dto.stationParameter.id) : undefined,
          station: {
            id: Text.create(dto.stationParameter.station.id),
            name: Text.create(dto.stationParameter.station.name),
          },
          parameter: {
            id: Text.create(dto.stationParameter.parameter.id),
            name: Text.create(dto.stationParameter.parameter.name),
          },
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

  get stationParameter(): {id?: Text,
    station: {
      id: Text,
      name: Text
    },
    parameter: {
      id: Text,
      name: Text
    }}{
    return this.props.stationParameter
  }

  get dto(): MeasurementDto{
    return {
      id: this.id.value,
      stationParameter: {
        id: this.stationParameter.id ? this.stationParameter.id.value : undefined,
        parameter: {
          id: this.stationParameter.parameter.id.value,
          name: this.stationParameter.parameter.name.value
        },
        station: {
          id: this.stationParameter.station.id.value,
          name: this.stationParameter.station.name.value
        }
      },
      unitOfMeasure: this.unitOfMeasure.value,
      value: this.value.value,
      createdAt: this.createdAt.value
    }
  }
}
