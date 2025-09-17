import { mock, MockProxy } from 'vitest-mock-extended'

import { UsersRepository } from '@/core/global/interfaces'
import { ListUsersUseCase } from '../list-users-use-case'
import {
  CursorPagination,
  Id,
  Logical,
  PlusInteger,
} from '@/core/global/domain/structures'
import { UsersFaker } from '../../domain/entities/fakers'

describe('Create User Use Case', () => {
  let repository: MockProxy<UsersRepository>
  let useCase: ListUsersUseCase
  const cursorPagination = CursorPagination.create({
    items: UsersFaker.fakeMany(5),
    pageSize: 1,
    nextCursor: null,
    previousCursor: null,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  beforeEach(() => {
    repository = mock<UsersRepository>()
    repository.findMany.mockResolvedValue(cursorPagination)
    useCase = new ListUsersUseCase(repository)
  })

  it('should find many users with pagination without cursors', async () => {
    const user = UsersFaker.fake()
    await useCase.execute({
      name: user.name.value,
      pageSize: 10,
      isActive: false,
    })

    expect(repository.findMany).toHaveBeenCalledWith({
      name: user.name,
      isActive: Logical.createAsFalse(),
      pageSize: PlusInteger.create(10),
      nextCursor: undefined,
      previousCursor: undefined,
    })
  })

  it('should find many users with pagination with cursors', async () => {
    const nextCursor = Id.create()
    const previousCursor = Id.create()

    await useCase.execute({
      pageSize: 20,
      isActive: true,
      nextCursor: nextCursor.value,
      previousCursor: previousCursor.value,
    })

    expect(repository.findMany).toHaveBeenCalledWith({
      pageSize: PlusInteger.create(20),
      isActive: Logical.createAsTrue(),
      nextCursor: nextCursor,
      previousCursor: previousCursor,
    })
  })

  it('should map each user to dto', async () => {
    const nextCursor = Id.create()
    const previousCursor = Id.create()

    const result = await useCase.execute({
      pageSize: 20,
      isActive: true,
      nextCursor: nextCursor.value,
      previousCursor: previousCursor.value,
    })

    expect(result).toEqual(cursorPagination.map((user) => user.dto).dto)
  })
})
