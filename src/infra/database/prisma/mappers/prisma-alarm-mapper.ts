import { AlarmDto } from '@/core/alerting/dtos/alarm.dto';
import { Alarm } from '@/core/alerting/domain/entities/alarm';
import { PrismaAlarm } from '../types';
import { $Enums } from '@prisma/client';

export class PrismaAlarmMapper {
  static toEntity(prismaAlarm: PrismaAlarm) {
    return Alarm.create(PrismaAlarmMapper.toDto(prismaAlarm))
  }

  static toPrisma(alarm: Alarm): PrismaAlarm {
    return {
      id: alarm.id.value,
      message: alarm.message.value,
      value: alarm.rule.threshold.value,
      operation: alarm.rule.operation.toString() as $Enums.Operation,
      level: alarm.level.toString(),
      parameterId: alarm.parameter.id.value,
      isActive: alarm.isActive.value,
      createdAt: alarm.createdAt.value,
      updatedAt: alarm.createdAt.value,
    }
  }

  static toDto(alarm: PrismaAlarm): AlarmDto{
    return {
      id: alarm.id,
      message: alarm.message,
      rule: {
        threshold: alarm.value,
        operation: alarm.operation
      },
      parameter: {
        id: alarm.parameterId
      },
      level: alarm.level,
      isActive: alarm.isActive as boolean,
      createdAt: alarm.createdAt as Date,
      updatedAt: alarm.updatedAt as Date
    } 
  }
}
