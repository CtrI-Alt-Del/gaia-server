import { CursorPagination, Id, Text } from '@/core/global/domain/structures'
import { User } from '@/core/membership/domain/entities'
import { UsersListingParams } from '@/core/membership/domain/types'

export interface UsersRepository {
  add(user: User): Promise<void>
  addMany(users: User[]): Promise<void>
  replace(user: User): Promise<void>
  findById(id: Id): Promise<User | null>
  findByEmail(email: Text): Promise<User | null>
  findMany(params: UsersListingParams): Promise<CursorPagination<User>>
}
