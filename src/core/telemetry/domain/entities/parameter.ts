import { Entity } from '@/core/global/domain/abstracts'
import { Logical, Numeric, Text, Timestamp } from '@/core/global/domain/structures'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'
import { Reading } from './reading'
import { Measurement } from './measurement'

type ParameterProps = {
  name: Text
  unitOfMeasure: Text
  code: Text
  factor: Numeric
  offset: Numeric
  isActive: Logical
  createdAt: Timestamp
  updatedAt?: Timestamp
}
export class Parameter extends Entity<ParameterProps> {
  static create(dto: ParameterDto): Parameter {
    return new Parameter(
      {
        name: Text.create(dto.name),
        unitOfMeasure: Text.create(dto.unitOfMeasure),
        code: Text.create(dto.code),
        factor: Numeric.create(dto.factor),
        offset: Numeric.create(dto.offset),
        isActive: Logical.create(dto.isActive ?? true),
        createdAt: Timestamp.create(dto.createdAt ?? new Date()),
        updatedAt: dto.updatedAt ? Timestamp.create(dto.updatedAt) : undefined,
      },
      dto.id,
    )
  }

  parseReading(reading: Reading): Measurement {
    const parsedValue = reading.value.multiply(this.factor).divide(this.offset)
    return Measurement.create({
      value: parsedValue.value,
      createdAt: new Date(),
      parameter: {
        id: this.id.value,
      },
    })
  }

  get name(): Text {
    return this.props.name
  }

  get code(): Text {
    return this.props.code
  }

  get unitOfMeasure(): Text {
    return this.props.unitOfMeasure
  }

  get factor(): Numeric {
    return this.props.factor
  }

  get offset(): Numeric {
    return this.props.offset
  }

  update(partialDto: Partial<ParameterDto>): Parameter {
    if (partialDto.name !== undefined) {
      this.props.name = Text.create(partialDto.name)
    }
    if (partialDto.unitOfMeasure !== undefined) {
      this.props.unitOfMeasure = Text.create(partialDto.unitOfMeasure)
    }
    if (partialDto.factor !== undefined) {
      this.props.factor = Numeric.create(partialDto.factor)
    }
    if (partialDto.offset !== undefined) {
      this.props.offset = Numeric.create(partialDto.offset)
    }
    this.refreshLastUpdate()
    return this
  }

  get dto(): ParameterDto {
    return {
      id: this.id.value,
      name: this.name.value,
      code: this.code.value,
      unitOfMeasure: this.unitOfMeasure.value,
      factor: this.factor.value,
      offset: this.offset.value,
      isActive: this.isActive.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt?.value,
    }
  }
}
