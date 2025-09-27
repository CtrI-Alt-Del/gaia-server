import { mock, MockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '@/core/membership/interfaces'
import { UsersFaker } from '../../domain/entities/fakers'
import { UserNotFoundError } from '../../domain/errors'
import { GetUserUseCase } from '../get-user-use-case'

describe('Get User Use Case', () => {
  let repository: MockProxy<UsersRepository>
  let useCase: GetUserUseCase

  beforeEach(() => {
    repository = mock<UsersRepository>()
    useCase = new GetUserUseCase(repository)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ userId: user.id.value })).rejects.toThrow(
      UserNotFoundError,
    )
  })

  it('should return the user dto', async () => {
    const user = UsersFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(user)

    const result = await useCase.execute({ userId: user.id.value })

    expect(result).toEqual(user.dto)
  })
})
