import { Entity } from '@/core/global/domain/abstracts'
import { Collection, Logical, Text, Timestamp } from '@/core/global/domain/structures'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { Coordinate, UnsignedId } from '@/core/telemetry/domain/structures'

type StationProps = {
  name: Text
  UID: UnsignedId
  location: Coordinate
  address: Text
  lastReadAt?: Timestamp
  parameters: Collection<Parameter>
  isActive: Logical
  createdAt: Timestamp
  updatedAt?: Timestamp
}
export class Station extends Entity<StationProps> {
  static create(dto: StationDto): Station {
    return new Station(
      {
        name: Text.create(dto.name),
        UID: UnsignedId.create(dto.UID),
        address: Text.create(dto.address),
        location: Coordinate.create(dto.latitude, dto.longitude),
        lastReadAt: dto.lastReadAt ? Timestamp.create(dto.lastReadAt) : undefined,
        parameters: Collection.createFrom<ParameterDto, Parameter>(
          dto.parameters,
          (paramDto) => Parameter.create(paramDto),
        ),
        isActive: Logical.create(dto?.isActive ?? true),
        createdAt: Timestamp.create(dto.createdAt ?? new Date()),
        updatedAt: dto.updatedAt ? Timestamp.create(dto.updatedAt) : undefined,
      },
      dto.id,
    )
  }
  get name(): Text {
    return this.props.name
  }
  get UID(): UnsignedId {
    return this.props.UID
  }
  get location(): Coordinate {
    return this.props.location
  }
  get lastReadAt(): Timestamp | undefined {
    return this.props.lastReadAt
  }
  get parameters(): Collection<Parameter> {
    return this.props.parameters
  }
  get adddress(): Text {
    return this.props.address
  }
  get dto(): StationDto {
    return {
      id: this.id.value,
      name: this.name.value,
      UID: this.UID.value.value,
      address: this.adddress.value,
      latitude: this.location.latitude.value,
      longitude: this.location.longitude.value,
      lastReadAt: this.lastReadAt ? this.lastReadAt.value : undefined,
      parameters: this.parameters.map((param) => param.dto).items,
      isActive: this.isActive.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt?.value,
    }
  }
  update(partialDto: Partial<StationDto>): Station {
    if (partialDto.name !== undefined) {
      this.props.name = Text.create(partialDto.name)
    }
    if (partialDto.UID !== undefined) {
      this.props.UID = UnsignedId.create(partialDto.UID)
    }
    if (partialDto.latitude !== undefined && partialDto.longitude !== undefined) {
      this.props.location = Coordinate.create(partialDto.latitude, partialDto.longitude)
    }
    if (partialDto.lastReadAt !== undefined) {
      this.props.lastReadAt = Timestamp.create(partialDto.lastReadAt)
    }
    if (partialDto.parameters !== undefined) {
      this.props.parameters = Collection.createFrom<ParameterDto, Parameter>(
        partialDto.parameters,
        (paramDto) => Parameter.create(paramDto),
      )
    }
    if (partialDto.address !== undefined) {
      this.props.address = Text.create(partialDto.address)
    }
    this.refreshLastUpdate()
    return this
  }
}
