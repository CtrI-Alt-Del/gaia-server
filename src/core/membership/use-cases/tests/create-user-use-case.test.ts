import { mock, MockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '@/core/global/interfaces'
import { CreateUserUseCase } from '../create-user-use-case'
import { UsersFaker } from '../../domain/entities/fakers'
import { EmailAlreadyInUseError, OwnerCreationNotAllowed } from '../../domain/errors'

describe('CreateUserUseCase', () => {
  let repository: MockProxy<UsersRepository>
  let useCase: CreateUserUseCase
  beforeEach(() => {
    repository = mock<UsersRepository>()
    useCase = new CreateUserUseCase(repository)
  })

  it('should throw an error if the user to be created is an owner', async () => {
    const user = UsersFaker.fake({ role: 'owner' })

    await expect(useCase.execute(user.dto)).rejects.toThrow(OwnerCreationNotAllowed)
  })

  it('should throw an error if the email of the user to be created is already in use', async () => {
    const user = UsersFaker.fake()
    repository.findByEmail.mockResolvedValue(user)

    await expect(useCase.execute(user.dto)).rejects.toThrow(EmailAlreadyInUseError)
  })

  it('should add the user to the repository', async () => {
    const user = UsersFaker.fake()
    repository.findByEmail.mockResolvedValue(null)

    await useCase.execute(user.dto)

    expect(repository.add).toHaveBeenCalledWith(user)
  })

  it('should return the created user dto', async () => {
    const user = UsersFaker.fake()
    repository.findByEmail.mockResolvedValue(null)

    const result = await useCase.execute(user.dto)

    expect(result).toEqual(user.dto)
  })
})
