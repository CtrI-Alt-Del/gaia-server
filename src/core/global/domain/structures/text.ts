import { ValidationException } from '@/core/global/domain/errors/validation-error'
import { Logical } from '@/core/global/domain/structures/logical'
import { PlusInteger } from '@/core/global/domain/structures/plus-integer'

export class Text {
  readonly value: string
  private constructor(value: string) {
    if (typeof value === 'string') {
      this.value = value
    } else {
      throw new ValidationException(value, 'Tem que ser uma string')
    }
  }

  static create(value: string): Text {
    return new Text(value)
  }

  charactersCount(): PlusInteger {
    return PlusInteger.create(this.value.length)
  }

  update(value: string): Text {
    return new Text(value)
  }

  equalsTo(other: Text): Logical {
    return Logical.create(this.value === other.value)
  }

  notEqualsTo(other: Text): Logical {
    return Logical.create(this.value !== other.value)
  }
}
