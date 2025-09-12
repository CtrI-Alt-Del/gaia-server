import { Text } from '@/core/global/domain/structures'
import { UseCase, UsersRepository } from '@/core/global/interfaces'
import { UserDto } from '../domain/entities/dtos'
import { User } from '../domain/entities/user'
import { EmailAlreadyInUseError, OwnerCreationNotAllowed } from '../domain/errors'

export class CreateUserUseCase implements UseCase<UserDto, UserDto> {
  constructor(private readonly repository: UsersRepository) {
    this.repository = repository
  }

  async execute(userDto: UserDto): Promise<UserDto> {
    const user = User.create(userDto)

    console.log(user.role.isOwner.isTrue)

    if (user.role.isOwner.isTrue) {
      throw new OwnerCreationNotAllowed()
    }

    await this.findUserByEmail(user.email)

    await this.repository.add(user)

    return user.dto
  }

  async findUserByEmail(email: Text): Promise<void> {
    const user = await this.repository.findByEmail(email)
    if (user) throw new EmailAlreadyInUseError()
  }
}
