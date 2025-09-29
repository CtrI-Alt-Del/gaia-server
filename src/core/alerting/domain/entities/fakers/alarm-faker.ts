import { faker } from '@faker-js/faker'
import { AlarmDto } from "@/core/alerting/dtos/alarm.dto"
import { Alarm } from "../alarm"

export class AlarmFaker {
  static fake(baseDto?: Partial<AlarmDto>): Alarm {
    return Alarm.create(AlarmFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AlarmDto>): AlarmDto {
    return {
        level: faker.word.adjective(),
        message: faker.word.verb(),
        rule: {
            operation: "GREATER_THAN",
            threshold: faker.number.int({min: 1, max: 100})
        },
        parameter: {},
        isActive: true,
        ...baseDto,
    }
  }

  static fakeMany(count: number, baseDto?: AlarmDto): Alarm[] {
    return Array.from({ length: count }, () => AlarmFaker.fake(baseDto))
  }
}