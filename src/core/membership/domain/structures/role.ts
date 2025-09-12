import { ValidationException } from '@/core/global/domain/errors/validation-error'
import { Logical } from '@/core/global/domain/structures/logical'

type RoleValue = 'owner' | 'member'

export class Role {
  readonly value: RoleValue

  private constructor(value: RoleValue) {
    this.value = value
  }

  static create(value: string): Role {
    if (!Role.isValidRole(value)) {
      throw new ValidationException('role', 'Tem que ser owner ou member')
    }
    return new Role(value)
  }

  static isValidRole(value: string): value is RoleValue {
    return value === 'owner' || value === 'member'
  }

  get isOwner(): Logical {
    return Logical.create(this.value === 'owner')
  }

  get isMember(): Logical {
    return Logical.create(this.value === 'member')
  }
}
