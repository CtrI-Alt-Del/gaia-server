import { CursorPagination, Id } from '@/core/global/domain/structures'
import { StationFourCoordsParams } from '@/core/global/types/station-four-coords-params'
import { StationsListingParams } from '@/core/global/types/stations-list-params'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { Station } from '@/core/telemetry/domain/entities/station'

export interface StationsRepository {
  add(station: Station, parametersIds: Id[]): Promise<void>
  add(station: Station, parametersIds: Id[]): Promise<void>
  findById(id: Id): Promise<Station | null>
  findMany(params: StationsListingParams): Promise<CursorPagination<Station>>
  replace(station: Station, parametersIds: Id[]): Promise<void>
  findManyByFourCoords(coords: StationFourCoordsParams): Promise<Station[]>
  countAll(): Promise<number>
  countActive(): Promise<number>
  findStationParameterDetails(
    stationUid: string,
    parameterName: string,
  ): Promise<{ parameter: Parameter; station: Station;stationParameterId: Id } | null>
}
