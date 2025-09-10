import { Logical, Text } from '@/core/global/domain/structures'

export class UsignedId {
  readonly value: Text
  private constructor(value: string) {
    this.value = Text.create(value)
  }
  static create(value: string): UsignedId {
    return new UsignedId(value)
  }
  static createFromNumber(value: number): UsignedId {
    return new UsignedId(value.toString())
  }
  equalsTo(other: UsignedId): Logical {
    return other.value.equalsTo(this.value)
  }
}
