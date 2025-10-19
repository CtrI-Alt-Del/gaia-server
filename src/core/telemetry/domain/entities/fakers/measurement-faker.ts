import { faker } from '@faker-js/faker'
import { MeasurementDto } from '../../dtos/measurement-dto'
import { Measurement } from '../measurement'

export class MeasurementFaker {
  static fake(baseDto?: Partial<MeasurementDto>): Measurement {
    return Measurement.create(MeasurementFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<MeasurementDto>): MeasurementDto {
    return {
      value: faker.number.float({ min: 0, max: 100 }),
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
      parameterId: faker.string.uuid(),
      stationId: faker.string.uuid(),
      stationName: faker.person.fullName(),
      parameterName: faker.person.fullName(),
      createdAt: new Date(),
      ...baseDto,
    }
  }

  static fakeMany(count: number, baseDto?: MeasurementDto): Measurement[] {
    return Array.from({ length: count }, () => MeasurementFaker.fake(baseDto))
  }
}
