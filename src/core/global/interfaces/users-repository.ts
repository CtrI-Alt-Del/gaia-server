import { User } from '@/core/membership/domain/entities'
import { CursorPagination, Text } from '../domain/structures'
import { UsersListingParams } from '@/core/membership/domain/types'

export interface UsersRepository {
  add(user: User): Promise<void>
  addMany(users: User[]): Promise<void>
  findByEmail(email: Text): Promise<User | null>
  findMany(params: UsersListingParams): Promise<CursorPagination<User>>
}
