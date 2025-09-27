import { Entity } from "@/core/global/domain/abstracts"
import { Logical, Text, Timestamp } from "@/core/global/domain/structures"
import { AlarmDto } from "../../dtos/alarm.dto"
import AlarmLevel from "../structures/alarm-level"
import AlertRule from "../structures/alert-rule"
import { ParameterAggregate } from "../../aggregate/parameter-aggregate"

type AlarmProps = {
  message: Text
  parameter: ParameterAggregate
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
        parameter: ParameterAggregate.create(dto.parameter),
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

  get rule(): AlertRule{
    return this.props.rule
  }

  get level(): AlarmLevel{
    return this.props.level
  }

  get parameter(): ParameterAggregate {
    return this.props.parameter
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
      parameter: this.props.parameter.dto,
      rule: this.props.rule.dto,
      level: this.props.level.toString(),
      isActive: this.props.isActive.value,
      createdAt: this.props.createdAt.value,
      updatedAt: this.props.updatedAt?.value,
    }
  }
}
