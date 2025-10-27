import { Id, Numeric, Text, Timestamp } from '@/core/global/domain/structures'
import { ReadingDto } from '../dtos'

export class Reading {
  private constructor(
    readonly id: Id,
    readonly stationUid: Text,
    readonly parameterCode: Text,
    readonly receivedAt: Timestamp,
    readonly value: Numeric,
  ) {}

  static create(dto: ReadingDto): Reading {
    return new Reading(
      Id.create(dto.id),
      Text.create(dto.stationUid),
      Text.create(dto.parameterCode),
      Timestamp.createFromNumber(dto.receivedAt),
      Numeric.create(dto.value),
    )
  }

  setValue(value: Numeric) {
    return Reading.create({
      ...this.dto,
      value: value.value,
    })
  }

  get dto(): ReadingDto {
    return {
      id: this.id.value,
      stationUid: this.stationUid.value,
      parameterCode: this.parameterCode.value,
      receivedAt: this.receivedAt.time,
      value: this.value.value,
    }
  }
}
