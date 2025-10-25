import { CursorPagination } from '@/core/global/domain/structures'
import { MeasurementListParams } from '@/core/global/types/measurement-list-params'
import { Measurement } from '../domain/entities/measurement'

export interface MeasurementRepository {
  findMany(params: MeasurementListParams): Promise<CursorPagination<Measurement>>
  createMany(measurements: Measurement[]): Promise<Measurement[]>
  create(measurement: Measurement): Promise<Measurement>
}

