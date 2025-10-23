import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { RawMeasurement } from '@/core/telemetry/types/raw-measurement' // Ajuste o path
import { MongoMeasurementsRepository } from '@/core/telemetry/interfaces'
import { RawMeasurementModel } from '@/infra/database/mongo/schemas'
import { RawMeasurementDocument } from '@/infra/database/mongo/types/raw-measurement-document'

@Injectable()
export class MongooseMeasurementsRepository implements MongoMeasurementsRepository {
  constructor(
    @InjectModel(RawMeasurementModel.name)
    private readonly measurementModel: Model<RawMeasurementDocument>,
  ) {}

  async findUnprocessed(limit: number): Promise<RawMeasurement[]> {
    const unprocessedDocs = await this.measurementModel
      .find({
        processed: { $exists: false },
      })
      .sort({ receivedAt: 1 })
      .limit(limit)
      .lean()
      .exec()

    return unprocessedDocs.map((doc: any) => {
      const { _id, ...rest } = doc
      const timestampInSeconds = rest.uxt || rest.unix || rest.receivedAt.getTime() / 1000
      return {
        ...rest, 
        _id: _id.toString(),
        uxt: Math.floor(timestampInSeconds), 
      } as RawMeasurement 
    })
  }

  async markAsProcessed(ids: string[]): Promise<void> {
    if (ids.length === 0) {
      return
    }
    const objectIds = ids.map((id) => new Types.ObjectId(id))

    await this.measurementModel
      .updateMany({ _id: { $in: objectIds } }, { $set: { processed: true } })
      .exec()
  }
}
