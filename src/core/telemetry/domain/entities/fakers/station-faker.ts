import { faker } from '@faker-js/faker'

import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Station } from '@/core/telemetry/domain/entities/station'
import { ParameterFaker } from './parameter-faker'

export class StationsFaker {
  static fake(baseDto?: Partial<StationDto>): Station {
    return Station.create(StationsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<StationDto>): StationDto {
    const parameters =
      baseDto?.parameters ??
      Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () =>
        ParameterFaker.fakeDto(),
      )

    return {
      name: `${faker.location.city()} Weather Station`,
      UID: faker.string.alphanumeric(8).toUpperCase(),
      address: faker.location.streetAddress(true),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      lastReadAt: faker.date.recent(),
      isActive: true,
      parameters,
      ...baseDto,
    }
  }

  static fakeMany(count: number, baseDto?: Partial<StationDto>): Station[] {
    return Array.from({ length: count }, () => StationsFaker.fake(baseDto))
  }
}
