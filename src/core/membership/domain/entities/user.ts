import type { UserDto } from '@/core/membership/domain/entities/dtos'
import { Logical, Text, Timestamp } from '@/core/global/domain/structures'
import { Entity } from '@/core/global/domain/abstracts'
import { Role } from '../structures'

export class UserProps {
  name: Text
  email: Text
  role: Role
  isActive: Logical
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export class User extends Entity<UserProps> {
  static create(dto: UserDto): User {
    console.log('dto', dto)
    return new User(
      {
        name: Text.create(dto.name),
        email: Text.create(dto.email),
        role: Role.create(dto.role),
        isActive: Logical.create(dto.isActive ?? true),
        createdAt: Timestamp.create(dto.createdAt ?? new Date()),
        updatedAt: dto.updatedAt ? Timestamp.create(dto.updatedAt) : undefined,
      },
      dto.id,
    )
  }

  get role(): Role {
    return this.props.role
  }

  get name(): Text {
    return this.props.name
  }

  get email(): Text {
    return this.props.email
  }

  get dto(): UserDto {
    return {
      id: this.id.value,
      name: this.name.value,
      email: this.email.value,
      role: this.role.value,
      isActive: this.isActive.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt?.value,
    }
  }
}
