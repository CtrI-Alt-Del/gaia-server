import { CursorPagination, Id } from '@/core/global/domain/structures'
import { StationsListingParams } from '@/core/global/types/stations-list-params'
import { Station } from '@/core/telemetry/domain/entities/station'

export interface StationsRepository {
  add(station: Station, parametersIds: Id[]): Promise<void>
  add(station: Station, parametersIds: Id[]): Promise<void>
  findById(id: Id): Promise<Station | null>
  findMany(params: StationsListingParams): Promise<CursorPagination<Station>>
  replace(station: Station, parametersIds: Id[]): Promise<void>
}
