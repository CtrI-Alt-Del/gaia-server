import { UsersRepository } from '../interfaces'
import { UserDto } from '../domain/entities/dtos'
import { Id } from '@/core/global/domain/structures'
import { UserNotFoundError } from '../domain/errors'

type Request = {
  userId: string
}

export class GetUserUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(params: Request): Promise<UserDto> {
    const user = await this.repository.findById(Id.create(params.userId))
    if (!user) throw new UserNotFoundError()
    return user.dto
  }
}
