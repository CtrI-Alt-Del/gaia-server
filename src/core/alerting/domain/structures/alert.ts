import { Logical, Numeric, Text } from '@/core/global/domain/structures'
import { Timestamp } from '@/core/global/domain/structures'
import { AlertDto } from '../../dtos/alert-dto'
import { AlarmLevel } from './alarm-level'
import { Entity } from '@/core/global/domain/abstracts'

type AlertProps = {
  message: Text
  parameterName: Text
  parameterUnitOfMeasure: Text
  parameterStationName: Text
  measurementValue: Numeric
  level: AlarmLevel
  createdAt: Timestamp
  isRead: Logical
}

export class Alert extends Entity<AlertProps> {
  static create(dto: AlertDto): Alert {
    return new Alert(
      {
        message: Text.create(dto.message),
        parameterName: Text.create(dto.parameterName),
        parameterUnitOfMeasure: Text.create(dto.parameterUnitOfMeasure),
        parameterStationName: Text.create(dto.parameterStationName),
        measurementValue: Numeric.create(dto.measurementValue),
        level: AlarmLevel.create(dto.level),
        createdAt: Timestamp.create(dto.createdAt ?? new Date()),
        isRead: Logical.create(dto.isRead),
      },
      dto.id,
    )
  }

  read() {
    this.props.isRead = Logical.create(true)
    this.refreshLastUpdate()
    return this
  }

  get message(): Text {
    return this.props.message
  }

  get parameterName(): Text {
    return this.props.parameterName
  }

  get parameterUnitOfMeasure(): Text {
    return this.props.parameterUnitOfMeasure
  }

  get parameterStationName(): Text {
    return this.props.parameterStationName
  }

  get measurementValue(): Numeric {
    return this.props.measurementValue
  }

  get level(): AlarmLevel {
    return this.props.level
  }

  get createdAt(): Timestamp {
    return this.props.createdAt
  }

  get isRead(): Logical {
    return this.props.isRead
  }

  get dto(): AlertDto {
    console.log(this.id.value)
    return {
      id: this.id.value,
      message: this.message.value,
      parameterName: this.parameterName.value,
      parameterUnitOfMeasure: this.parameterUnitOfMeasure.value,
      parameterStationName: this.parameterStationName.value,
      measurementValue: this.measurementValue.value,
      isRead: this.isRead.value,
      level: this.level.toString(),
      createdAt: this.createdAt.value,
    }
  }
}
