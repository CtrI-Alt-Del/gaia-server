import { Integer } from '@/core/global/domain/structures/integer'
import { Reading } from '../domain/entities/reading'
import { Id } from '@/core/global/domain/structures'

export interface ReadingsRepository {
  findMany(limit: Integer): Promise<Reading[]>
  deleteMany(readingIds: Id[]): Promise<void>
}
