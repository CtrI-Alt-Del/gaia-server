import { ValidationException } from '../errors'
import { Logical } from './logical'

export class Numeric {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number): Numeric {
    if (!Number.isFinite(value)) {
      throw new ValidationException('value', 'must be a number')
    }
    return new Numeric(value)
  }

  isGreaterThan(other: Numeric): Logical {
    return Logical.create(this.value > other.value)
  }

  isLessThan(other: Numeric): Logical {
    return Logical.create(this.value < other.value)
  }

  isGreaterThanOrEqual(other: Numeric): Logical {
    return Logical.create(this.value >= other.value)
  }

  isLessThanOrEqual(other: Numeric): Logical {
    return Logical.create(this.value <= other.value)
  }

  isEqual(other: Numeric): Logical {
    return Logical.create(this.value === other.value)
  }

  plus(other: Numeric): Numeric {
    return Numeric.create(this.value + other.value)
  }

  minus(other: Numeric): Numeric {
    return Numeric.create(this.value - other.value)
  }

  multiply(other: Numeric): Numeric {
    return Numeric.create(this.value * other.value)
  }

  divide(other: Numeric): Numeric {
    return Numeric.create(this.value / other.value)
  }
}
