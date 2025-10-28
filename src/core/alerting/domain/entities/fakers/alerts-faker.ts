import { faker } from '@faker-js/faker'
import { AlertDto } from '@/core/alerting/dtos/alert-dto'
import { Alert } from '../../structures/alert'

export class AlertFaker {
  static fake(baseDto?: Partial<AlertDto>): Alert {
    return Alert.create(AlertFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AlertDto>): AlertDto {
    return {
      id: faker.string.uuid(),
      level: faker.helpers.arrayElement(['WARNING', 'CRITICAL']),
      message: faker.lorem.sentence(),
      createdAt: faker.date.between({ from: '2024-08-01', to: '2025-10-20' }),
      measurementValue: faker.number.float(),
      parameterName: faker.lorem.word(),
      parameterUnitOfMeasure: faker.lorem.word(),
      parameterStationName: faker.lorem.word(),
      isRead: faker.datatype.boolean(),
      ...baseDto,
    }
  }

  static fakeMany(count: number, baseDto?: Partial<AlertDto>): Alert[] {
    return Array.from({ length: count }, () => AlertFaker.fake(baseDto))
  }
}
