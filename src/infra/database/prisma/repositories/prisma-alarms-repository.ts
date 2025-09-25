import { Injectable } from '@nestjs/common'

import type { AlarmsRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'
import { Alarm } from '@/core/alerting/domain/entities/alarm'
import { PrismaAlarmMapper } from '../mappers'
import { Id } from '@/core/global/domain/structures'

@Injectable()
export class PrismaAlarmsRepository implements AlarmsRepository {
  constructor(private readonly prisma: Prisma) {}
  async add(alarm: Alarm): Promise<void> {
    const prismaAlarm = PrismaAlarmMapper.toPrisma(alarm)
    await this.prisma.alarm.create({data: prismaAlarm})
  }

  async findById(id: Id): Promise<Alarm | null> {
    const prismaAlarm = await this.prisma.alarm.findUnique({
      where: {id: id.value}
    })

    if (!prismaAlarm) {
      return null
    }

    return PrismaAlarmMapper.toEntity(prismaAlarm)
  }

  async replace(alarm: Alarm): Promise<void> {
    const prismaAlarm = PrismaAlarmMapper.toPrisma(alarm)
    await this.prisma.alarm.update({
      where: {id: prismaAlarm.id},
      data: prismaAlarm
    })
  }
}
