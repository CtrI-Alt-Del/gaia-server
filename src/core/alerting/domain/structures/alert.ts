import { Logical, Numeric, Text } from '@/core/global/domain/structures'
import { Timestamp } from '@/core/global/domain/structures'
import { AlertDto } from '../../dtos/alert-dto'
import { AlarmLevel } from './alarm-level'

export class Alert {
  private constructor(
    readonly message: Text,
    readonly parameterName: Text,
    readonly parameterUnitOfMeasure: Text,
    readonly parameterStationName: Text,
    readonly measurementValue: Numeric,
    readonly level: AlarmLevel,
    readonly createdAt: Timestamp,
    readonly isRead: Logical,
  ) {}

  static create(dto: AlertDto): Alert {
    return new Alert(
      Text.create(dto.message),
      Text.create(dto.parameterName),
      Text.create(dto.parameterUnitOfMeasure),
      Text.create(dto.parameterStationName),
      Numeric.create(dto.measurementValue),
      AlarmLevel.create(dto.level),
      Timestamp.create(dto.createdAt),
      Logical.create(dto.isRead),
    )
  }

  get dto(): AlertDto {
    return {
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
