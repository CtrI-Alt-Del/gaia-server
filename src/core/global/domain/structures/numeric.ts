import { ValidationException } from '../errors'

export class Numeric {
  readonly value: number

  private constructor(value: number) {
    this.value = value
  }

  static create(value: number): Numeric {
    if (typeof value !== 'number') {
      throw new ValidationException('value', 'must be a number')
    }
    return new Numeric(value)
  }
}
