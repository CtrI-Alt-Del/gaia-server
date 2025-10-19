import { Operation } from './operation'
import { AlarmRuleDto } from '../../dtos/alarm-rule.dto'
import { Integer } from '@/core/global/domain/structures/integer'

type Type = { threshold: number; operation: string }

export class AlertRule {
  public readonly threshold: Integer
  public readonly operation: Operation

  private constructor(rule: Type) {
    this.threshold = Integer.create(rule.threshold)
    this.operation = Operation.create(rule.operation)
  }

  static create(rule: Type) {
    return new AlertRule(rule)
  }

  get dto(): AlarmRuleDto {
    return {
      threshold: this.threshold.value,
      operation: this.operation.toString(),
    }
  }
}
