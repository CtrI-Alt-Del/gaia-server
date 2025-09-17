import { Logical } from '@/core/global/domain/structures/logical'

export class PlusInteger {
  readonly value: number
  private constructor(value: number) {
    this.value = value
  }
  static create(value: number): PlusInteger {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error('Value must be a positive integer')
    }
    return new PlusInteger(value)
  }

  equals(other: PlusInteger): Logical {
    return Logical.create(this.value === other.value)
  }

  plus(other: PlusInteger): PlusInteger {
    return new PlusInteger(this.value + other.value)
  }
  
  minus(other: PlusInteger): PlusInteger {
    const result = this.value - other.value
    if (result < 0) {
      throw new Error('Result must be a positive integer')
    }
    return new PlusInteger(result)
  }
}
