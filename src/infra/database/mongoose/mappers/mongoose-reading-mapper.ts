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

  static toStructure(mongooseReading: MongooseReading): Reading[] {
    const readings = MongooseReadingMapper.toDto(mongooseReading)
    return readings.map(Reading.create)
  }

  static toDto(mongooseReading: MongooseReading): ReadingDto[] {
    const keys = Object.keys(mongooseReading)
    const parametersCode = keys.filter(
      (key) => !MongooseReadingMapper.META_KEYS.includes(key),
    )
    const readings: ReadingDto[] = []

    for (const parameterCode of parametersCode) {
      const value = mongooseReading[parameterCode]
      if (!value) throw new AppError('Missing parameter value')

      readings.push({
        id: mongooseReading._id.toString(),
        stationUid: mongooseReading.uid,
        receivedAt: mongooseReading.uxt * 1000,
        parameterCode: parameterCode,
        value: value,
      })
    }
    return readings
  }
}
