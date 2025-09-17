import { Id } from '@/core/global/domain/structures'
import { Station } from '@/core/telemetry/domain/entities/station'

export interface StationsRepository {
  add(station: Station): Promise<void>
  findById(id: Id): Promise<Station | null>
  replace(station: Station): Promise<void>
}
