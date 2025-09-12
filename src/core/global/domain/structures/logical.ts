export class Logical {
  readonly value: boolean

  private constructor(value: boolean) {
    this.value = value
  }

  static create(value: boolean): Logical {
    if (typeof value === 'boolean') {
      return new Logical(value)
    }
    throw new Error('Value must be a boolean')
  }

  equals(other: Logical): boolean {
    return this.value === other.value
  }

  static createAsTrue(): Logical {
    return new Logical(true)
  }

  static createAsFalse(): Logical {
    return new Logical(false)
  }

  becomeTrue(): Logical {
    return new Logical(true)
  }

  becomeFalse(): Logical {
    return new Logical(false)
  }

  get isTrue(): boolean {
    return this.value === true
  }

  get isFalse(): boolean {
    return this.value === false
  }
}
