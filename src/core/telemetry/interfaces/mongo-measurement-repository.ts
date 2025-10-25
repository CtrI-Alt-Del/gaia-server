import { RawMeasurement } from '@/core/telemetry/types/raw-measurement'

export interface MongoMeasurementsRepository {
  findUnprocessed(limit: number): Promise<RawMeasurement[]>
  deleteProcessed(ids: string[]): Promise<void>
}
