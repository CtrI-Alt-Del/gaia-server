import type Prisma from '@prisma/client'

import { AlarmDto } from '@/core/alerting/dtos/alarm.dto';
import { Alarm } from '@/core/alerting/domain/entities/alarm';

export class PrismaAlarmMapper {
  static toEntity(prismaAlarm: Prisma.Alarm) {
    return Alarm.create(PrismaAlarmMapper.toDto(prismaAlarm))
  }

  static toPrisma() {}

  static toDto(alarm: Prisma.Alarm): AlarmDto{
    return {
      id: alarm.id,
      message: alarm.message,
      rule: {
        threshold: alarm.value as unknown as bigint,
        operation: alarm.operation
      },
      level: alarm.level,
      isActive: alarm.isActive,
      createdAt: alarm.createdAt,
      updatedAt: alarm.updatedAt
    } 
  }
}
