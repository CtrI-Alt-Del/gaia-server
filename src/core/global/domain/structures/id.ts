import { createId } from '@paralleldrive/cuid2'

import { Logical } from '@/core/global/domain/structures/logical'

export class Id {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(value?: string): Id {
    return new Id(value ?? createId())
  }

  static createRandom(): Id {
    return new Id(createId())
  }

  equals(id: Id): Logical {
    return Logical.create(this.value === id.value)
  }
}
