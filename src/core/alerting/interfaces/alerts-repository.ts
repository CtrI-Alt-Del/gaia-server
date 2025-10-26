import { CursorPagination, Id, Numeric } from '@/core/global/domain/structures'
import { AlertListingParams } from '@/core/global/types/'
import { Alert } from '../domain/entities'
import { AlarmLevel } from '../domain/structures'

export interface AlertsRepository {
  add(alarmId: Id, stationParameterId: Id, measurementValue: Numeric): Promise<void>
  findMany(params: AlertListingParams): Promise<CursorPagination<Alert>>
  findById(id: Id): Promise<Alert | null>
  findLast(): Promise<Alert[]>
  countByAlarmLevel(alertLevel: AlarmLevel): Promise<number>
  replace(alert: Alert): Promise<void>
  countByTimePeriod(timePeriod: "MONTHLY" | "WEEKLY"): Promise<{countCritical: number, countWarning: number, time: string}[]>
}
