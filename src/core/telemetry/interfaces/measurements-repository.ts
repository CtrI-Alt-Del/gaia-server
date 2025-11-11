import { CursorPagination, Id, Timestamp } from '@/core/global/domain/structures'
import { MeasurementListParams } from '@/core/global/types/measurement-list-params'
import { Measurement } from '../domain/entities/measurement'

export interface MeasurementsRepository {
  findMany(params: MeasurementListParams): Promise<CursorPagination<Measurement>>
  findManyMeasurementsByStationId(stationId: Id): Promise<Measurement[]>
  getMonthlyAverageByStationParameter(
    stationId: Id,
    parameterId: Id,
    month: Timestamp,
  ): Promise<number>
  createMany(measurements: Measurement[]): Promise<void>
}
