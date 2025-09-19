import { Id, Text } from '@/core/global/domain/structures'
import { UseCase, UsersRepository } from '@/core/global/interfaces'
import { UserDto } from '../domain/entities/dtos'
import { User } from '../domain/entities'
import { EmailAlreadyInUseError, UserNotFoundError } from '../domain/errors'

type Request = UserDto
type Response = UserDto

export class UpdateUserUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(userDto: UserDto): Promise<Response> {
    const user = await this.findUserById(Id.create(userDto.id))

    console.log('user', user)
    console.log('userDto', userDto)

    if (user.email.value !== userDto.email) {
      await this.findUserByEmail(user.email)
    }

    user.update(userDto)

    await this.repository.replace(user)
    return user.dto
  }

  async findUserById(id: Id): Promise<User> {
    const user = await this.repository.findById(id)
    if (!user) throw new UserNotFoundError()
    return user
  }

  async findUserByEmail(email: Text): Promise<void> {
    const user = await this.repository.findByEmail(email)
    if (user) throw new EmailAlreadyInUseError()
  }
}
