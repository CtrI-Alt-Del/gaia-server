import { Aggregate } from "@/core/global/domain/abstracts/aggregate";
import {
  Logical,
  PlusInteger,
  Text,
  Timestamp,
} from "@/core/global/domain/structures";
import { Parameter } from "@/core/telemetry/entities/parameter";
import { ParameterAggregateDto } from "../dtos/parameteraggregate.dto";
import { Integer } from "@/core/global/domain/structures/integer";

type ParameterAggregateProps = {
  isActive: Logical;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
};

export class ParameterAggregate extends Aggregate<
  ParameterAggregateProps,
  Parameter
> {
  private static readonly ENTITY_NAME = "Parameter";
  static create(dto: ParameterAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: dto.entity.name,
        unitOfMeasure: dto.entity.unitOfMeasure,
        numberOfDecimalPlaces: dto.entity.numberOfDecimalPlaces,
        factor: dto.entity.factor,
        offset: dto.entity.offset,
      };

      return new ParameterAggregate(
        {
          isActive: Logical.create(dto.isActive),
          createdAt: Timestamp.create(dto.createdAt),
        },
        this.ENTITY_NAME,
        Parameter.create(entity),
        dto.id
      );
    } else {
      return new ParameterAggregate(
        {
          isActive: Logical.create(dto.isActive),
          createdAt: Timestamp.create(dto.createdAt),
        },
        this.ENTITY_NAME
      );
    }
  }

  get name(): Text {
    return this.getEntity().name;
  }

  get unitOfMeasure(): Text {
    return this.getEntity().unitOfMeasure;
  }

  get numberOfDecimalPlaces(): PlusInteger {
    return this.getEntity().numberOfDecimalPlaces;
  }

  get offset(): Integer {
    return this.getEntity().offset;
  }

  get isActive(): Logical {
    return this.props.isActive;
  }

  get createdAt(): Timestamp {
    return this.props.createdAt;
  }

  get updatedAt(): Timestamp | undefined {
    return this.props.updatedAt;
  }

  get dto(): ParameterAggregateDto {
    return {
      id: this.id.value,
      entity: this.hasEntity().isTrue
        ? {
            name: this.getEntity().name.value,
            unitOfMeasure: this.getEntity().unitOfMeasure.value,
            numberOfDecimalPlaces:
              this.getEntity().numberOfDecimalPlaces.value,
            factor: this.getEntity().factor.value,
            offset: this.getEntity().offset.value,
          }
        : undefined,
      isActive: this.props.isActive.value,
      createdAt: this.props.createdAt.value,
      updatedAt: this.props.updatedAt?.value,
    };
  }
}
