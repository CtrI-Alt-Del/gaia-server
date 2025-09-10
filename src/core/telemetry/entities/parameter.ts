import { Entity } from '@/core/global/domain/abstracts'
import { PlusInteger, Text } from '@/core/global/domain/structures'
import { Integer } from '@/core/global/domain/structures/integer'
import { ParameterDto } from '@/core/telemetry/dtos/parameter.dto'

type ParameterProps = {
  name: Text
  unitOfMeasure: Text
  numberOfDecimalPlaces: PlusInteger
  factor: Integer
  offset: Integer
}
export class Parameter extends Entity<ParameterProps> {
  static create(dto: ParameterDto): Parameter {
    console.log('dto', dto)
    return new Parameter(
      {
        name: Text.create(dto.name),
        unitOfMeasure: Text.create(dto.unitOfMeasure),
        numberOfDecimalPlaces: PlusInteger.create(dto.numberOfDecimalPlaces),
        factor: Integer.create(dto.factor),
        offset: Integer.create(dto.offset),
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
  get dto(): ParameterDto {
    return {
      id: this.id.value,
      name: this.name.value,
      unitOfMeasure: this.unitOfMeasure.value,
      numberOfDecimalPlaces: this.numberOfDecimalPlaces.value,
      factor: this.factor.value,
      offset: this.offset.value,
    }
  }
  update(partialDto: Partial<ParameterDto>): Parameter {
    if (partialDto.name !== undefined) {
      this.props.name = Text.create(partialDto.name)
    }
    if (partialDto.unitOfMeasure !== undefined) {
      this.props.unitOfMeasure = Text.create(partialDto.unitOfMeasure)
    }
    if (partialDto.numberOfDecimalPlaces !== undefined) {
      this.props.numberOfDecimalPlaces = PlusInteger.create(
        partialDto.numberOfDecimalPlaces,
      )
    }
    if (partialDto.factor !== undefined) {
      this.props.factor = Integer.create(partialDto.factor)
    }
    if (partialDto.offset !== undefined) {
      this.props.offset = Integer.create(partialDto.offset)
    }
    this.refreshLastUpdate()
    return this
  }
}
