import { mock, MockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '@/core/membership/interfaces'
import { CreateUserUseCase } from '../create-user-use-case'
import { UsersFaker } from '../../domain/entities/fakers'
import { EmailAlreadyInUseError, OwnerCreationNotAllowed } from '../../domain/errors'
import { EventBroker } from '@/core/global/interfaces'
import { UserCreatedEvent } from '../../domain/events'

describe('Create User Use Case', () => {
  let repository: MockProxy<UsersRepository>
  let eventBroker: MockProxy<EventBroker>
  let useCase: CreateUserUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    eventBroker = mock<EventBroker>()
    useCase = new CreateUserUseCase(repository, eventBroker)
  })

  it('should throw an error if the user to be created is an owner', async () => {
    const user = UsersFaker.fake({ role: 'owner' })
    const request = { ...user.dto, accountPassword: 'password123' }

    await expect(useCase.execute(request)).rejects.toThrow(OwnerCreationNotAllowed)
  })

  it('should throw an error if the email of the user to be created is already in use', async () => {
    const user = UsersFaker.fake()
    const request = { ...user.dto, accountPassword: 'password123' }
    repository.findByEmail.mockResolvedValue(user)

    await expect(useCase.execute(request)).rejects.toThrow(EmailAlreadyInUseError)
  })

  it('should add the user to the repository', async () => {
    const user = UsersFaker.fake({ isActive: true })
    const request = { ...user.dto, accountPassword: 'password123' }
    repository.findByEmail.mockResolvedValue(null)

    await useCase.execute(request)

    expect(repository.add).toHaveBeenCalledWith(user)
  })

  it('should return the created user dto', async () => {
    const user = UsersFaker.fake()
    const request = { ...user.dto, accountPassword: 'password123' }
    repository.findByEmail.mockResolvedValue(null)

    const result = await useCase.execute(request)

    expect(result).toEqual(user.dto)
  })

  it('should publish UserCreatedEvent when user is created successfully', async () => {
    const user = UsersFaker.fake()
    const request = { ...user.dto, accountPassword: 'password123' }
    repository.findByEmail.mockResolvedValue(null)

    await useCase.execute(request)

    const event = new UserCreatedEvent({
      userId: user.id.value,
      userEmail: user.email.value,
    })

    expect(eventBroker.publish).toHaveBeenCalledWith(event)
  })

  it('should not publish event when user creation fails due to owner role', async () => {
    const user = UsersFaker.fake({ role: 'owner' })
    const request = { ...user.dto, accountPassword: 'password123' }

    await expect(useCase.execute(request)).rejects.toThrow(OwnerCreationNotAllowed)

    expect(eventBroker.publish).not.toHaveBeenCalled()
  })

  it('should not publish event when user creation fails due to email already in use', async () => {
    const user = UsersFaker.fake()
    const request = { ...user.dto, accountPassword: 'password123' }
    repository.findByEmail.mockResolvedValue(user)

    await expect(useCase.execute(request)).rejects.toThrow(EmailAlreadyInUseError)

    expect(eventBroker.publish).not.toHaveBeenCalled()
  })
})
