import { Entity } from '@/core/global/domain/abstracts'
import { Collection, Text, Timestamp } from '@/core/global/domain/structures'
import { ParameterDto } from '@/core/telemetry/dtos/parameter.dto'
import { StationDto } from '@/core/telemetry/dtos/station.dto'
import { Parameter } from '@/core/telemetry/entities/parameter'
import { Coordinate, UsignedId } from '@/core/telemetry/structures'

type StationProps = {
  name: Text
  UID: UsignedId
  location: Coordinate
  lastReadAt: Timestamp
  parameters: Collection<Parameter>
}
export class Station extends Entity<StationProps> {
  static create(dto: StationDto): Station {
    return new Station(
      {
        name: Text.create(dto.name),
        UID: UsignedId.create(dto.UID),
        location: Coordinate.create(dto.latitude, dto.longitude),
        lastReadAt: Timestamp.createFromDate(dto.lastReadAt),
        parameters: Collection.createFrom<ParameterDto, Parameter>(
          dto.parameters,
          (paramDto) => Parameter.create(paramDto),
        ),
      },
      dto.id,
    )
  }
  get name(): Text {
    return this.props.name
  }
  get UID(): UsignedId {
    return this.props.UID
  }
  get location(): Coordinate {
    return this.props.location
  }
  get lastReadAt(): Timestamp {
    return this.props.lastReadAt
  }
  get parameters(): Collection<Parameter> {
    return this.props.parameters
  }
  get dto(): StationDto {
    return {
      id: this.id.value,
      name: this.name.value,
      UID: this.UID.value.value,
      latitude: this.location.latitude.value,
      longitude: this.location.longitude.value,
      lastReadAt: this.lastReadAt.toDate(),
      parameters: this.parameters.map((param) => param.dto).items,
    }
  }
}
