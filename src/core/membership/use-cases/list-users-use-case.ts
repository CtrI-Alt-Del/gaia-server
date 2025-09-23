import { UsersRepository } from '@/core/membership/interfaces'
import { CursorPaginationDto } from '@/core/global/domain/structures/dtos'
import { Id, Status, Text } from '@/core/global/domain/structures'
import { PlusInteger } from '@/core/global/domain/structures'
import { UserDto } from '../domain/entities/dtos'

type Request = {
  nextCursor?: string
  previousCursor?: string
  pageSize: number
  status: string
  name?: string
}

export class ListUsersUseCase {
  constructor(private readonly repository: UsersRepository) {}

  async execute(params: Request): Promise<CursorPaginationDto<UserDto>> {
    const pagination = await this.repository.findMany({
      nextCursor: params.nextCursor ? Id.create(params.nextCursor) : undefined,
      previousCursor: params.previousCursor
        ? Id.create(params.previousCursor)
        : undefined,
      pageSize: PlusInteger.create(params.pageSize),
      status: Status.create(params.status),
      name: params.name ? Text.create(params.name) : undefined,
    })

    return pagination.map((user) => user.dto).dto
  }
}
