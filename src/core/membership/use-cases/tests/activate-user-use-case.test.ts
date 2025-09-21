import { mock, MockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '@/core/membership/interfaces'
import { UsersFaker } from '../../domain/entities/fakers'
import { UserAlreadyActivatedError, UserNotFoundError } from '../../domain/errors'
import { ActivateUserUseCase } from '../activate-user-use-case'

describe('Activate User Use Case', () => {
  let repository: MockProxy<UsersRepository>
  let useCase: ActivateUserUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    useCase = new ActivateUserUseCase(repository)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: user.id.value })).rejects.toThrow(
      UserNotFoundError,
    )
  })

  it('should throw an error if the user is already activated', async () => {
    const user = UsersFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(user)

    await expect(() => useCase.execute({ id: user.id.value })).rejects.toThrow(
      UserAlreadyActivatedError,
    )
  })

  it('should replace the user in the repository', async () => {
    const user = UsersFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({ id: user.id.value })

    expect(repository.replace).toHaveBeenCalledWith(user)
  })

  it('should return the updated user dto', async () => {
    const user = UsersFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(user)

    const result = await useCase.execute({ id: user.id.value })

    expect(result).toEqual(user.dto)
  })
})
