import { Alarm } from '@/core/alerting/domain/entities/alarm'
import { CursorPagination, Id } from '@/core/global/domain/structures'
import { AlarmListingParams } from '@/core/global/types/alarm-listing-params'

export interface AlarmsRepository {
  add(alarm: Alarm): Promise<void>
  findAllByStationParameter(stationParameterId: Id): Promise<Alarm[]>
  findMany(params: AlarmListingParams): Promise<CursorPagination<Alarm>>
  findById(id: Id): Promise<Alarm | null>
  replace(alarm: Alarm): Promise<void>
}
