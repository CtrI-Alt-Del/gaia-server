import cuid from 'cuid'

import { Logical } from '@/core/global/domain/structures/logical'

export class Id {
  readonly value: string

  private constructor(value: string) {
    this.value = value
  }
  static create(value?: string): Id {
    return new Id(value ?? cuid())
  }

  static createRandom(): Id {
    return new Id(cuid())
  }

  equals(id: Id): Logical {
    return Logical.create(this.value === id.value)
  }
}
