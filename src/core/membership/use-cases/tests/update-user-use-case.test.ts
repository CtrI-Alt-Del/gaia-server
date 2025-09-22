import { mock, MockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '@/core/membership/interfaces'
import { UpdateUserUseCase } from '../update-user-use-case'
import { UsersFaker } from '../../domain/entities/fakers'
import { EmailAlreadyInUseError, UserNotFoundError } from '../../domain/errors'

describe('Update User Use Case', () => {
  let repository: MockProxy<UsersRepository>
  let useCase: UpdateUserUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    useCase = new UpdateUserUseCase(repository)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute(user.dto)).rejects.toThrow(UserNotFoundError)
  })

  it('should throw an error if the user email is already in use', async () => {
    const currentUser = UsersFaker.fake({ email: 'test1@test.com' })
    const user = UsersFaker.fake({ email: 'test2@test.com' })
    repository.findById.mockResolvedValue(currentUser)
    repository.findByEmail.mockResolvedValue(currentUser)

    await expect(() => useCase.execute(user.dto)).rejects.toThrow(EmailAlreadyInUseError)
  })

  it('should replace the user in the repository', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)
    repository.findByEmail.mockResolvedValue(null)

    await useCase.execute(user.dto)

    expect(repository.replace).toHaveBeenCalledWith(user)
  })

  it('should return the updated user dto', async () => {
    const user = UsersFaker.fake()
    repository.findById.mockResolvedValue(user)
    repository.findByEmail.mockResolvedValue(null)

    const result = await useCase.execute(user.dto)

    expect(result).toEqual(user.dto)
  })
})
