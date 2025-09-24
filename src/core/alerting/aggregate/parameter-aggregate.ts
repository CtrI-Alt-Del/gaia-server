import { Aggregate } from '@/core/global/domain/abstracts/aggregate'
import {Text} from '@/core/global/domain/structures'
import { ParameterAggregateDto } from '../dtos/parameter-aggregate.dto'

type ParameterAggregateEntity = {
  name: Text
  unitOfMeasure: Text
}

export class ParameterAggregate extends Aggregate<ParameterAggregateEntity> {
  private static readonly ENTITY_NAME = 'Parameter'
  static create(dto: ParameterAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: Text.create(dto.entity.name),
        unitOfMeasure: Text.create(dto.entity.unitOfMeasure),
      }

      return new ParameterAggregate(ParameterAggregate.ENTITY_NAME, dto.id as string, entity)
    } else {
      return new ParameterAggregate(ParameterAggregate.ENTITY_NAME, dto.id as string)
    }
  }

  get name(): Text {
    return this.getEntity().name
  }

  get unitOfMeasure(): Text {
    return this.getEntity().unitOfMeasure
  }

  get dto(): ParameterAggregateDto {
    return {
      id: this.id.value,
      entity: this.hasEntity().isTrue
        ? {
            name: this.getEntity().name.value,
            unitOfMeasure: this.getEntity().unitOfMeasure.value
          }
        : undefined,
    }
  }
}
