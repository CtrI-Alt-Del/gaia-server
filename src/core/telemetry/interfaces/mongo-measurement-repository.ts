import { RawMeasurement } from '@/core/telemetry/types/raw-measurement'

export interface MongoMeasurementsRepository {
  findUnprocessed(limit: number): Promise<RawMeasurement[]>
  markAsProcessed(ids: string[]): Promise<void>
}
