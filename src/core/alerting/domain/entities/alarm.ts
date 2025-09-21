import { Entity } from '@/core/global/domain/abstracts'
import { Logical, Text, Timestamp } from '@/core/global/domain/structures'
import { AlarmDto } from '../../dtos/alarm.dto'
import { MeasurementAggregate } from '../../aggregate/measurement-aggregate'
import AlarmLevel from '../structures/alarm-level'
import AlertRule from '../structures/alert-rule'

type AlarmProps = {
  message: Text
  measurement: MeasurementAggregate
  rule: AlertRule
  level: AlarmLevel
  isActive: Logical
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export class Alarm extends Entity<AlarmProps> {
  static create(dto: AlarmDto): Alarm {
    return new Alarm(
      {
        message: Text.create(dto.message),
        measurement: MeasurementAggregate.create(dto.measurement),
        rule: AlertRule.create(dto.rule),
        level: AlarmLevel.create(dto.level),
        isActive: Logical.create(dto.isActive),
        createdAt: Timestamp.create(dto.createdAt ?? new Date()),
      },
      dto.id,
    )
  }

  get message(): Text {
    return this.props.message
  }

  get parameter(): MeasurementAggregate {
    return this.props.measurement
  }

  get isActive(): Logical {
    return this.props.isActive
  }

  get createdAt(): Timestamp {
    return this.props.createdAt
  }

  get updatedAt(): Timestamp | undefined {
    return this.props.updatedAt
  }

  get dto(): AlarmDto {
    return {
      id: this.id.value,
      message: this.props.message.value,
      measurement: this.props.measurement.dto,
      rule: this.props.rule.dto,
      level: this.props.level.toString(),
      isActive: this.props.isActive.value,
      createdAt: this.props.createdAt.value,
      updatedAt: this.props.updatedAt?.value,
    }
  }
}
