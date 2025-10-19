import { AlarmDto } from '@/core/alerting/dtos/alarm.dto'
import { Alarm } from '@/core/alerting/domain/entities/alarm'
import type Prisma from '@prisma/client'
import { $Enums } from '@prisma/client'
import { PrismaAlarm } from '../types'

export class PrismaAlarmMapper {
  static toEntity(prismaAlarm: PrismaAlarm) {
    return Alarm.create(PrismaAlarmMapper.toDto(prismaAlarm))
  }

  static toPrisma(alarm: Alarm): Prisma.Alarm {
    return {
      id: alarm.id.value,
      message: alarm.message.value,
      value: alarm.rule.threshold.value,
      operation: alarm.rule.operation.toString() as $Enums.Operation,
      level: alarm.level.toString(),
      stationParameterId: alarm.parameter.id.value,
      isActive: alarm.isActive.value,
      createdAt: alarm.createdAt.value,
      updatedAt: alarm.createdAt.value,
    }
  }

  static toDto(alarm: PrismaAlarm): AlarmDto {
    return {
      id: alarm.id,
      message: alarm.message,
      rule: {
        threshold: alarm.value,
        operation: alarm.operation,
      },
      parameter: {
        id: alarm.StationParameter.parameter.id,
        entity: {
          name: alarm.StationParameter.parameter.name,
          unitOfMeasure: alarm.StationParameter.parameter.unitOfMeasure,
          stationName: alarm.StationParameter.station.name,
        },
      },
      level: alarm.level,
      isActive: alarm.isActive as boolean,
      createdAt: alarm.createdAt as Date,
      updatedAt: alarm.updatedAt as Date,
    }
  }
}
