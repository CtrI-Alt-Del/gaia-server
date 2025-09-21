import { Text } from '@/core/global/domain/structures'
import { EventBroker, UseCase } from '@/core/global/interfaces'
import { UsersRepository } from '@/core/membership/interfaces'
import { UserDto } from '../domain/entities/dtos'
import { User } from '../domain/entities/user'
import { EmailAlreadyInUseError, OwnerCreationNotAllowed } from '../domain/errors'
import { UserCreatedEvent } from '../domain/events'

export class CreateUserUseCase implements UseCase<UserDto, UserDto> {
  constructor(
    private readonly repository: UsersRepository,
    private readonly eventBroker: EventBroker,
  ) {}

  async execute(userDto: UserDto): Promise<UserDto> {
    const user = User.create(userDto)

    if (user.role.isOwner.isTrue) {
      throw new OwnerCreationNotAllowed()
    }

    await this.findUserByEmail(user.email)

    await this.repository.add(user)

    const event = new UserCreatedEvent({
      userId: user.id.value,
      userEmail: user.email.value,
    })
    await this.eventBroker.publish(event)

    return user.dto
  }

  async findUserByEmail(email: Text): Promise<void> {
    const user = await this.repository.findByEmail(email)
    if (user) throw new EmailAlreadyInUseError()
  }
}
