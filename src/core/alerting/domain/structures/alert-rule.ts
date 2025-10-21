import { Operation } from './operation'
import { AlarmRuleDto } from '../../dtos/alarm-rule.dto'
import { Integer } from '@/core/global/domain/structures/integer'
import { Logical, Numeric } from '@/core/global/domain/structures'

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

  apply(value: Numeric): Logical {
    if (this.operation.isTypeGreaterThan.isTrue) {
      return value.isGreaterThan(this.threshold.numeric)
    }
    if (this.operation.isTypeLessThan.isTrue) {
      return value.isLessThan(this.threshold.numeric)
    }
    if (this.operation.isTypeGreaterThanOrEqual.isTrue) {
      return value.isGreaterThanOrEqual(this.threshold.numeric)
    }
    if (this.operation.isTypeLessThanOrEqual.isTrue) {
      return value.isLessThanOrEqual(this.threshold.numeric)
    }
    if (this.operation.isTypeEqual.isTrue) {
      return value.isEqual(this.threshold.numeric)
    }
    return Logical.createAsFalse()
  }

  get dto(): AlarmRuleDto {
    return {
      threshold: this.threshold.value,
      operation: this.operation.toString(),
    }
  }
}
