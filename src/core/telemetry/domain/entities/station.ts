import { Entity } from '@/core/global/domain/abstracts'
import { Logical, Text, Timestamp } from '@/core/global/domain/structures'
import { Integer } from '@/core/global/domain/structures/integer'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Coordinate, UnsignedId } from '@/core/telemetry/domain/structures'

type StationProps = {
  name: Text
  uid: UnsignedId
  coordinate: Coordinate
  address: Text
  lastReadAt?: Timestamp
  quantityOfParameters: Integer
  isActive: Logical
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export class Station extends Entity<StationProps> {
  static create(dto: StationDto): Station {
    return new Station(
      {
        name: Text.create(dto.name),
        uid: UnsignedId.create(dto.uid),
        address: Text.create(dto.address),
        coordinate: Coordinate.create(dto.latitude, dto.longitude),
        quantityOfParameters: Integer.create(dto.quantityOfParameters ?? 0),
        lastReadAt: dto.lastReadAt ? Timestamp.create(dto.lastReadAt) : undefined,
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

  get uid(): UnsignedId {
    return this.props.uid
  }

  get coordinate(): Coordinate {
    return this.props.coordinate
  }

  get quantityOfParameters(): Integer {
    return this.props.quantityOfParameters
  }

  get lastReadAt(): Timestamp | undefined {
    return this.props.lastReadAt
  }

  get address(): Text {
    return this.props.address
  }

  update(partialDto: Partial<StationDto>): Station {
    if (partialDto.name !== undefined) {
      this.props.name = Text.create(partialDto.name)
    }

    if (partialDto.uid !== undefined) {
      this.props.uid = UnsignedId.create(partialDto.uid)
    }

    if (partialDto.latitude !== undefined || partialDto.longitude !== undefined) {
      this.props.coordinate = Coordinate.create(
        partialDto.latitude ?? this.coordinate.latitude.value,
        partialDto.longitude ?? this.coordinate.longitude.value,
      )
    }

    if (partialDto.lastReadAt) {
      this.props.lastReadAt = Timestamp.create(partialDto.lastReadAt)
    }

    if (partialDto.address !== undefined) {
      this.props.address = Text.create(partialDto.address)
    }

    this.refreshLastUpdate()
    return this
  }

  updateLastReadAt() {
    this.props.lastReadAt = Timestamp.createFromNow()
    this.refreshLastUpdate()
    return this
  }

  get dto(): StationDto {
    return {
      id: this.id.value,
      name: this.name.value,
      uid: this.uid.value.value,
      address: this.address.value,
      latitude: this.coordinate.latitude.value,
      longitude: this.coordinate.longitude.value,
      quantityOfParameters: this.quantityOfParameters.value,
      lastReadAt: this.lastReadAt ? this.lastReadAt.value : undefined,
      isActive: this.isActive.value,
      createdAt: this.createdAt.value,
      updatedAt: this.updatedAt?.value,
    }
  }
}
