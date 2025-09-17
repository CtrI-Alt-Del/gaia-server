import { CursorPagination, Id } from '@/core/global/domain/structures'
import { StationWithCount } from '@/core/global/types'
import { StationsListingParams } from '@/core/global/types/stations-list-params'
import { Station } from '@/core/telemetry/domain/entities/station'

export interface StationsRepository {
  add(station: Station): Promise<void>
  findById(id: Id): Promise<Station | null>
  findMany(params:StationsListingParams): Promise<CursorPagination<StationWithCount>>
  replace(station: Station): Promise<void>
  deleteById(id: Id): Promise<void>
}
