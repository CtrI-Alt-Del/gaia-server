import { faker } from '@faker-js/faker'

import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'

export class ParameterFaker {
  static fake(baseDto?: Partial<ParameterDto>): Parameter {
    return Parameter.create(ParameterFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ParameterDto>): ParameterDto {
    return {
      name: faker.person.fullName(),
      code: faker.string.uuid(),
      unitOfMeasure: faker.helpers.arrayElement([
        '°C',
        '°F',
        'K',
        '%',
        'hPa',
        'atm',
        'mmHg',
        'Pa',
        'm/s',
        'km/h',
        'mph',
        'kn',
        '°',
        'mm',
        'cm',
        'in',
        'm',
        'km',
        'mi',
        'm',
        'cm',
        'ft',
        'W/m²',
        'µW/cm²',
        'UV Index',
        'V',
        'A',
        'W',
        'kW',
        'kWh',
        'J',
        'kJ',
        'Wh',
        'kWh',
        'dBm',
        '%',
        'AQI',
        'µg/m³',
        'ppm',
      ]),
      factor: faker.number.float({ min: 0, max: 100 }),
      offset: faker.number.float({ min: 0, max: 100 }),
      isActive: true,
      ...baseDto,
    }
  }

  static fakeMany(count: number, baseDto?: ParameterDto): Parameter[] {
    return Array.from({ length: count }, () => ParameterFaker.fake(baseDto))
  }
}
