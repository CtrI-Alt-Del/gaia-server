import { AlarmDto } from '@/core/alerting/dtos/alarm.dto';
import { Alarm } from '@/core/alerting/domain/entities/alarm';
import { PrismaAlarm } from '../types';
import Operation from '@/core/alerting/domain/structures/Operation';
import { $Enums } from '@prisma/client';
import { ValidationException } from '@/core/global/domain/errors';

const prismaEnumMapper = (operation: Operation): $Enums.Operation => {
  if (operation.isTypeEqual()) {return "EQUAL"}
  if (operation.isTypeBigger()) {return "GREATER_THAN"}
  if (operation.isTypeLess()) {return "LESS_THAN"}
  if (operation.isTypeBiggerEqual()) {return "GREATER_THAN_OR_EQUAL"}
  if (operation.isTypeLessEqual()) {return "LESS_THAN_OR_EQUAL"}
  throw new ValidationException("operation", "com valor inválido")
}

export class PrismaAlarmMapper {
  static toEntity(prismaAlarm: PrismaAlarm) {
    return Alarm.create(PrismaAlarmMapper.toDto(prismaAlarm))
  }

  static toPrisma(alarm: Alarm): PrismaAlarm {
    return {
      id: alarm.id.value,
      message: alarm.message.value,
      value: alarm.rule.threshold as unknown as number,
      operation: prismaEnumMapper(alarm.rule.operation),
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
        threshold: alarm.value as unknown as bigint,
        operation: alarm.operation
      },
      parameter: {
        id: alarm.parameter?.id as string,
        entity: {
          name: alarm.parameter?.name as string,
          unitOfMeasure: alarm.parameter?.unitOfMeasure as string
        }
      },
      level: alarm.level,
      isActive: alarm.isActive,
      createdAt: alarm.createdAt,
      updatedAt: alarm.updatedAt
    } 
  }
}
