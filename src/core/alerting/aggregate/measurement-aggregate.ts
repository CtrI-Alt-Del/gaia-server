import { Aggregate } from '@/core/global/domain/abstracts/aggregate'
import { Numeric, Text, Timestamp } from '@/core/global/domain/structures'
import { MeasurementAggregateDto } from '../dtos/measurement-aggregate.dto'

type MeasurementAggregateEntity = {
  value: Numeric
  stationuuid: Text
  createdAt: Timestamp
  parameterId: Text
}

export class MeasurementAggregate extends Aggregate<MeasurementAggregateEntity> {
  private static readonly ENTITY_NAME = 'Measurement'
  static create(dto: MeasurementAggregateDto) {
    if (dto.entity) {
      const entity = {
        value: Numeric.create(dto.entity.value),
        stationuuid: Text.create(dto.entity.stationuuid),
        parameterId: Text.create(dto.entity.parameterId),
        createdAt: Timestamp.create(dto.entity.createdAt as Date),
      }

      return new MeasurementAggregate(
        MeasurementAggregate.ENTITY_NAME,
        dto.id ?? '',
        entity,
      )
    } else {
      return new MeasurementAggregate(MeasurementAggregate.ENTITY_NAME, dto.id ?? '')
    }
  }

  get value(): Numeric {
    return this.getEntity().value
  }

  get stationuuid(): Text {
    return this.getEntity().stationuuid
  }

  get createdAt(): Timestamp {
    return this.getEntity().createdAt
  }

  get dto(): MeasurementAggregateDto {
    return {
      id: this.id.value,
      entity: this.hasEntity().isTrue
        ? {
            value: this.getEntity().value.value,
            stationuuid: this.getEntity().stationuuid.value,
            parameterId: this.getEntity().parameterId.value,
            createdAt: this.getEntity().createdAt.value,
          }
        : undefined,
    }
  }
}
