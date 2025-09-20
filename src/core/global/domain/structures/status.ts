import { ValidationException } from '../errors'
import { Logical } from './logical'

type StatusValue = 'all' | 'active' | 'inactive'

export class Status {
  constructor(readonly value: StatusValue) {}

  static create(value: string): Status {
    if (!Status.isValidStatus(value)) {
      throw new ValidationException('status', 'Tem que ser all, active ou inactive')
    }
    return new Status(value)
  }

  private static isValidStatus(value: string): value is StatusValue {
    return value === 'all' || value === 'active' || value === 'inactive'
  }

  get isAll(): Logical {
    return Logical.create(this.value === 'all')
  }

  get isActive(): Logical {
    return Logical.create(this.value === 'active')
  }

  get isInactive(): Logical {
    return Logical.create(this.value === 'inactive')
  }
}
