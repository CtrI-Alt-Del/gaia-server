import { Id } from '@/core/global/domain/structures'
import { UseCase, UsersRepository } from '@/core/global/interfaces'
import { UserDto } from '../domain/entities/dtos'
import { User } from '../domain/entities'
import { UserNotFoundError } from '../domain/errors'
import { UserAlreadyActivatedError } from '../domain/errors'

type Request = {
  id: string
}
type Response = UserDto

export class ActivateUserUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: UsersRepository) {}

  async execute(userDto: Request): Promise<Response> {
    const user = await this.findUserById(Id.create(userDto.id))

    if (user.isActive.isTrue) {
      throw new UserAlreadyActivatedError()
    }

    user.activate()

    await this.repository.replace(user)
    return user.dto
  }

  async findUserById(id: Id): Promise<User> {
    const user = await this.repository.findById(id)
    if (!user) throw new UserNotFoundError()
    return user
  }
}
