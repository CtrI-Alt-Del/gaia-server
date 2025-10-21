import { Aggregate } from '@/core/global/domain/abstracts/aggregate'
import { Text } from '@/core/global/domain/structures'
import { ParameterAggregateDto } from '../../dtos/parameter-aggregate-dto'

type ParameterAggregateEntity = {
  name: Text
  unitOfMeasure: Text
  stationName: Text
}

export class ParameterAggregate extends Aggregate<ParameterAggregateEntity> {
  private static readonly ENTITY_NAME = 'Parameter'
  static create(dto: ParameterAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: Text.create(dto.entity.name),
        unitOfMeasure: Text.create(dto.entity.unitOfMeasure),
        stationName: Text.create(dto.entity.stationName),
      }

      return new ParameterAggregate(
        ParameterAggregate.ENTITY_NAME,
        dto.id as string,
        entity,
      )
    } else {
      return new ParameterAggregate(ParameterAggregate.ENTITY_NAME, dto.id as string)
    }
  }

  get name(): Text {
    return this.entity.name
  }

  get unitOfMeasure(): Text {
    return this.entity.unitOfMeasure
  }

  get stationName(): Text {
    return this.entity.stationName
  }

  get dto(): ParameterAggregateDto {
    return {
      id: this.id.value,
      entity: this.hasEntity.isTrue
        ? {
            name: this.name.value,
            unitOfMeasure: this.unitOfMeasure.value,
            stationName: this.stationName.value,
          }
        : undefined,
    }
  }
}
