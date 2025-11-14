import { ReadingDto } from '@/core/telemetry/domain/dtos'
import { MongooseReading } from '../types'
import { AppError } from '@/core/global/domain/errors'
import { Reading } from '@/core/telemetry/domain/entities/reading'

export class MongooseReadingMapper {
  private static readonly META_KEYS = [
    '$__',
    '$isNew',
    '_doc',
    '_id',
    'uid',
    'uxt',
    'receivedAt',
    'topic',
    'isProcessed',
  ]

  static toStructure(mongooseReading: MongooseReading) {
    return Reading.create(MongooseReadingMapper.toDto(mongooseReading))
  }

  static toDto(mongooseReading: MongooseReading): ReadingDto {
    const keys = Object.keys(mongooseReading)
    const parameterCode = keys.find(
      (key) => !MongooseReadingMapper.META_KEYS.includes(key),
    )
    if (!parameterCode) {
      throw new AppError('Invalid reading format')
    }
    const value = mongooseReading[parameterCode]
    return {
      id: mongooseReading._id.toString(),
      stationUid: mongooseReading.uid,
      receivedAt: mongooseReading.uxt * 1000,
      parameterCode: parameterCode,
      value: value,
    }
  }
}
