import { faker } from '@faker-js/faker'

import { User } from '../user'
import { UserDto } from '../dtos'

export class UsersFaker {
  static fake(baseDto?: Partial<UserDto>): User {
    return User.create(UsersFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<UserDto>): UserDto {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      role: 'member',
      isActive: faker.datatype.boolean(),
      ...baseDto,
    }
  }

  static fakeMany(count: number, baseDto?: UserDto): User[] {
    return Array.from({ length: count }, () => UsersFaker.fake(baseDto))
  }
}
