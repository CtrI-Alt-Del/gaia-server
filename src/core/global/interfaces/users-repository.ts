import { User } from '@/core/membership/domain/entities'
import { Text } from '../domain/structures'

export interface UsersRepository {
  add(user: User): Promise<void>
  findByEmail(email: Text): Promise<User | null>
}
