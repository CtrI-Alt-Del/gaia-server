import { CursorPagination, Id } from '@/core/global/domain/structures'
import { StationFourCoordsParams } from '@/core/global/types/station-four-coords-params'
import { StationsListingParams } from '@/core/global/types/stations-list-params'
import { Station } from '@/core/telemetry/domain/entities/station'

export interface StationsRepository {
  add(station: Station, parametersIds: Id[]): Promise<void>
  findById(id: Id): Promise<Station | null>
  findMany(params: StationsListingParams): Promise<CursorPagination<Station>>
  replaceWithParameters(station: Station, parametersIds: Id[]): Promise<void>
  replace(station: Station): Promise<void>
  findByParameterId(stationParameterId: Id): Promise<Station | null>
  findManyByFourCoords(coords: StationFourCoordsParams): Promise<Station[]>
  countAll(): Promise<number>
  countActive(): Promise<number>
}
