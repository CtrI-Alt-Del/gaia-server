import { Logical } from '@/core/global/domain/structures/logical'
import { createId } from '@paralleldrive/cuid2'

export class Id {
  readonly value: string
  private constructor(value: string) {
    this.value = value
  }
  static create(value: string): Id {
    return new Id(value)
  }
  static createRandom(): Id {
    return new Id(createId())
  }
  equals(id: Id): Logical {
    return Logical.create(this.value === id.value)
  }
}
