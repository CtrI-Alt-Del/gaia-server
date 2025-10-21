import { CursorPagination, Id } from '@/core/global/domain/structures'
import { AlertListingParams } from '@/core/global/types/'
import { Alert } from '../domain/entities'

export interface AlertsRepository {
  add(alarmId: Id, measurementId: Id): Promise<void>
  findMany(params: AlertListingParams): Promise<CursorPagination<Alert>>
  findById(id: Id): Promise<Alert | null>
  countByLevel(level: 'WARNING' | 'CRITICAL'): Promise<number>
  replace(alert: Alert): Promise<void>
}
