import { Injectable } from '@nestjs/common'

import type { AlarmsRepository } from '@/core/global/interfaces'

import { Id } from '@/core/global/domain/structures'
import { Alarm } from '@/core/alerting/domain/entities/alarm'
import { AlarmListingParams } from '@/core/global/types/alarm-listing-params'
import { CursorPagination } from '@/core/global/domain/structures'

import { PrismaRepository } from './prisma-repository'
import { PrismaAlarmMapper } from '../mappers'

@Injectable()
export class PrismaAlarmsRepository extends PrismaRepository implements AlarmsRepository {
  async countByLevel(level: 'warning' | 'critical'): Promise<number> {
    return await this.prisma.alarm.count({
      where: {
        level: level.toUpperCase(),
        isActive: true,
      },
    });
  }
  async add(alarm: Alarm): Promise<void> {
    const prismaAlarm = PrismaAlarmMapper.toPrisma(alarm)
    await this.prisma.alarm.create({ data: prismaAlarm })
  }

  async findMany({
    nextCursor,
    previousCursor,
    pageSize,
    status,
    level,
  }: AlarmListingParams): Promise<CursorPagination<Alarm>> {
    const whereClause = {
      ...(status?.isAll.isTrue ? {} : { isActive: status?.isActive.isTrue }),
      ...(level ? { level: { contains: level.value === 'all' ? '' : level.value } } : {}),
    }

    const query = this.createPaginationQuery(
      this.prisma.alarm,
      whereClause,
      undefined,
      undefined,
      {
        StationParameter: {
          include: {
            station: true,
            parameter: true,
          },
        },
      },
    )

    const result = await this.paginateWithCursor<any>(query, {
      nextCursor,
      previousCursor,
      pageSize,
    })

    return result.map(PrismaAlarmMapper.toEntity)
  }

  async findById(id: Id): Promise<Alarm | null> {
    const prismaAlarm = await this.prisma.alarm.findUnique({
      where: { id: id.value },
      include: {
        StationParameter: {
          include: {
            station: true,
            parameter: true,
          },
        },
      },
    })

    if (!prismaAlarm) {
      return null
    }

    return PrismaAlarmMapper.toEntity(prismaAlarm)
  }

  async replace(alarm: Alarm): Promise<void> {
    const prismaAlarm = PrismaAlarmMapper.toPrisma(alarm)
    await this.prisma.alarm.update({
      where: { id: prismaAlarm.id },
      data: prismaAlarm,
    })
  }
}
