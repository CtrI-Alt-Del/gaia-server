import { Logical } from '@/core/global/domain/structures/logical'
import { Numeric } from './numeric'

export class Integer {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number): Integer {
    if (Number.isNaN(value)) {
      throw new Error('Value must be a integer')
    }
    return new Integer(value)
  }

  equals(other: Integer): Logical {
    return Logical.create(this.value === other.value)
  }

  plus(other: Integer): Integer {
    return new Integer(this.value + other.value)
  }

  minus(other: Integer): Integer {
    const result = this.value - other.value
    return new Integer(result)
  }

  get numeric(): Numeric {
    return Numeric.create(this.value)
  }
}
