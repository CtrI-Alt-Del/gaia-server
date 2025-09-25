import { Injectable } from '@nestjs/common'

import type { AlarmsRepository } from '@/core/global/interfaces'

import { Prisma } from '../client'
import { Alarm } from '@/core/alerting/domain/entities/alarm'
import { PrismaAlarmMapper } from '../mappers'
import { AlarmListingParams } from '@/core/global/types/alarm-list-params'
import { CursorPagination } from '@/core/global/domain/structures'
import { PrismaRepository } from './prisma-repository'

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
  
      const query = this.createPaginationQuery(this.prisma.parameter, whereClause)
  
      const result = await this.paginateWithCursor<any>(query, {
        nextCursor,
        previousCursor,
        pageSize,
      })
  
      return result.map(PrismaAlarmMapper.toEntity)
    }
  }
