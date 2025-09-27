import { Injectable } from '@nestjs/common'

import type { AlarmsRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'
import { Alarm } from '@/core/alerting/domain/entities/alarm'
import { PrismaAlarmMapper } from '../mappers'
import { AlarmListingParams } from '@/core/global/types/alarm-list-params'
import { CursorPagination } from '@/core/global/domain/structures'
import { PrismaRepository } from './prisma-repository'
import { Id } from '@/core/global/domain/structures'

@Injectable()
export class PrismaAlarmsRepository extends PrismaRepository implements AlarmsRepository {

  async add(alarm: Alarm): Promise<void> {
    const prismaAlarm = PrismaAlarmMapper.toPrisma(alarm)
    await this.prisma.alarm.create({data: prismaAlarm})
  }
  
  async findMany({
      nextCursor,
      previousCursor,
      pageSize,
      status,
    }: AlarmListingParams): Promise<CursorPagination<Alarm>> {
      const whereClause = status?.isAll.isTrue
        ? undefined
        : { isActive: status?.isActive.isTrue }
  
      const query = this.createPaginationQuery(this.prisma.alarm, whereClause)
  
      const result = await this.paginateWithCursor<any>(query, {
        nextCursor,
        previousCursor,
        pageSize,
      })
  
      return result.map(PrismaAlarmMapper.toEntity)
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
