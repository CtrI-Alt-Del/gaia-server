import { Entity } from '@/core/global/domain/abstracts'
import { Collection, PlusInteger, Text } from '@/core/global/domain/structures'
import { Integer } from '@/core/global/domain/structures/integer'
import { ParameterDto } from '@/core/telemetry/dtos/parameter.dto'

// @TODO: Define alert rule structure when ready
type mockAlertRule = {
  value: any
}

type ParameterProps = {
  name: Text
  unitOfMeasure: Text
  numberOfDecimalPlaces: PlusInteger
  factor: Integer
  offset: Integer
  alertRules: Collection<mockAlertRule>
}
export class Parameter extends Entity<ParameterProps> {
  static create(dto: ParameterDto): Parameter {
    return new Parameter(
      {
        name: Text.create(dto.name),
        unitOfMeasure: Text.create(dto.unitOfMeasure),
        numberOfDecimalPlaces: PlusInteger.create(dto.numberOfDecimalPlaces),
        factor: Integer.create(dto.factor),
        offset: Integer.create(dto.offset),
        alertRules: Collection.create<mockAlertRule>(dto.alertRules),
      },
      dto.id,
    )
  }
  get name(): Text {
    return this.props.name
  }
  get unitOfMeasure(): Text {
    return this.props.unitOfMeasure
  }
  get numberOfDecimalPlaces(): PlusInteger {
    return this.props.numberOfDecimalPlaces
  }
  get factor(): Integer {
    return this.props.factor
  }
  get offset(): Integer {
    return this.props.offset
  }
  get alertRules(): Collection<mockAlertRule> {
    return this.props.alertRules
  }
  get dto(): ParameterDto {
    return {
      id: this.id.value,
      name: this.name.value,
      unitOfMeasure: this.unitOfMeasure.value,
      numberOfDecimalPlaces: this.numberOfDecimalPlaces.value,
      factor: this.factor.value,
      offset: this.offset.value,
      alertRules: this.alertRules.items,
    }
  }
  update(partialDto: Partial<ParameterDto>): Parameter {
    if (partialDto.name !== undefined) {
      this.props.name = Text.create(partialDto.name);
    }
    if (partialDto.unitOfMeasure !== undefined) {
      this.props.unitOfMeasure = Text.create(partialDto.unitOfMeasure);
    }
    if (partialDto.numberOfDecimalPlaces !== undefined) {
      this.props.numberOfDecimalPlaces = PlusInteger.create(
        partialDto.numberOfDecimalPlaces,
      );
    }
    if (partialDto.factor !== undefined) {
      this.props.factor = Integer.create(partialDto.factor);
    }
    if (partialDto.offset !== undefined) {
      this.props.offset = Integer.create(partialDto.offset);
    }
    if (partialDto.alertRules !== undefined) {
      this.props.alertRules = Collection.create<mockAlertRule>(
        partialDto.alertRules,
      );
    }
    this.refreshLastUpdate()
    return this
  }
}
