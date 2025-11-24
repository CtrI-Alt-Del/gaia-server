import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { ReadingsRepository } from '@/core/telemetry/interfaces'
import { Reading } from '@/core/telemetry/domain/entities/reading'
import { Id, Integer } from '@/core/global/domain/structures'

import { ReadingModel } from '@/infra/database/mongoose/models'
import { MongooseReadingMapper } from '../mappers/mongoose-reading-mapper'
import { MongooseReading } from '../types'

@Injectable()
export class MongooseReadingsRepository implements ReadingsRepository {
  constructor(
    @InjectModel(ReadingModel.name)
    private readonly readingModel: Model<MongooseReading>,
  ) {}

  async findMany(limit: Integer): Promise<Reading[]> {
    const documents = await this.readingModel
      .find()
      .sort({ receivedAt: 1 })
      .limit(limit.value)
      .exec()

    return documents.flatMap(MongooseReadingMapper.toStructure)
  }

  async deleteMany(ids: Id[]): Promise<void> {
    await this.readingModel.deleteMany({ _id: { $in: ids.map((id) => id.value) } }).exec()
  }
}
