import { Logical, Text } from '@/core/global/domain/structures'

export class UnsignedId {
  readonly value: Text
  private constructor(value: string) {
    this.value = Text.create(value)
  }
  static create(value: string): UnsignedId {
    return new UnsignedId(value)
  }
  static createFromNumber(value: number): UnsignedId {
    return new UnsignedId(value.toString())
  }
  equalsTo(other: UnsignedId): Logical {
    return other.value.equalsTo(this.value)
  }
}
