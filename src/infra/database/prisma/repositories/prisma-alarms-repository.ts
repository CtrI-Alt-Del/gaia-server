import { Injectable } from '@nestjs/common'

import type { AlarmsRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'
import { Alarm } from '@/core/alerting/domain/entities/alarm'
import { PrismaAlarmMapper } from '../mappers'

@Injectable()
export class PrismaAlarmsRepository implements AlarmsRepository {
  constructor(private readonly prisma: Prisma) {}
  async add(alarm: Alarm): Promise<void> {
    const prismaAlarm = PrismaAlarmMapper.toPrisma(alarm)
    await this.prisma.alarm.create({data: prismaAlarm})
  }
}
