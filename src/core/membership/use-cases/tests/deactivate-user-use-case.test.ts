import { mock, MockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '@/core/global/interfaces'
import { UsersFaker } from '../../domain/entities/fakers'
import { UserAlreadyDeactivatedError, UserNotFoundError } from '../../domain/errors'
import { DeactivateUserUseCase } from '../deactivate-user-use-case'

describe('Deactivate User Use Case', () => {
  let repository: MockProxy<UsersRepository>
  let useCase: DeactivateUserUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    useCase = new DeactivateUserUseCase(repository)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: user.id.value })).rejects.toThrow(
      UserNotFoundError,
    )
  })

  it('should throw an error if the user is already deactivated', async () => {
    const user = UsersFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(user)

    await expect(() => useCase.execute({ id: user.id.value })).rejects.toThrow(
      UserAlreadyDeactivatedError,
    )
  })

  it('should replace the user in the repository', async () => {
    const user = UsersFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({ id: user.id.value })

    expect(repository.replace).toHaveBeenCalledWith(user)
  })

  it('should return the updated user dto', async () => {
    const user = UsersFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(user)

    const result = await useCase.execute({ id: user.id.value })

    expect(result).toEqual(user.dto)
  })
})
