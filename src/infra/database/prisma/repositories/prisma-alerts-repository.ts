import { Injectable } from '@nestjs/common'

import { AlertsRepository } from '@/core/alerting/interfaces'
import { Id, Integer, Numeric, TimePeriod } from '@/core/global/domain/structures'
import { Alert } from '@/core/alerting/domain/entities'
import { AlertListingParams } from '@/core/global/types/alerts-listing-params'
import { CursorPagination } from '@/core/global/domain/structures'

import { PrismaRepository } from './prisma-repository'
import { PrismaAlertMapper } from '../mappers'
import { AlarmLevel } from '@/core/alerting/domain/structures'

@Injectable()
export class PrismaAlertsRepository extends PrismaRepository implements AlertsRepository {
  async add(
    alarmId: Id,
    stationParameterId: Id,
    measurementValue: Numeric,
  ): Promise<void> {
    await this.prisma.alert.create({
      data: {
        alarmId: alarmId.value,
        measurementValue: measurementValue.value,
        stationParameterId: stationParameterId.value,
      },
    })
  }

  async findMany({
    nextCursor,
    previousCursor,
    pageSize,
    level,
    date,
  }: AlertListingParams): Promise<CursorPagination<Alert>> {
    const whereClause = {
      ...(date ? { createdAt: this.createDateQuery(date) } : {}),
      ...(level && level.value !== 'all' ? { alarm: { level: level.value } } : {}),
    }

    const query = this.createPaginationQuery(
      this.prisma.alert,
      whereClause,
      undefined,
      undefined,
      {
        alarm: true,
        stationParameter: {
          include: {
            parameter: true,
            station: true,
          },
        },
      },
    )

    const result = await this.paginateWithCursor<any>(query, {
      nextCursor,
      previousCursor,
      pageSize,
    })

    return result.map(PrismaAlertMapper.toEntity)
  }

  async findLast(): Promise<Alert[]> {
    const prismaAlerts = await this.prisma.alert.findMany({
      include: {
        alarm: true,
        stationParameter: {
          include: {
            parameter: true,
            station: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    })
    return prismaAlerts.map(PrismaAlertMapper.toEntity)
  }

  async findById(id: Id): Promise<Alert | null> {
    const prismaAlert = await this.prisma.alert.findUnique({
      where: { id: id.value },
      include: {
        alarm: true,
        stationParameter: {
          include: {
            parameter: true,
            station: true,
          },
        },
      },
    })

    if (!prismaAlert) {
      return null
    }

    return PrismaAlertMapper.toEntity(prismaAlert)
  }

  async countByAlarmLevel(alertLevel: AlarmLevel): Promise<number> {
    return await this.prisma.alert.count({
      where: {
        alarm: {
          level: alertLevel.value,
        },
      },
    })
  }

  async replace(alert: Alert): Promise<void> {
    await this.prisma.alert.update({
      where: { id: alert.id.value },
      data: {
        isRead: alert.isRead.value,
      },
    })
  }

  async countByTimePeriod(
    timePeriod: TimePeriod,
  ): Promise<{ criticalCount: number; warningCount: number; time: string }[]> {
    const today = new Date()

    today.setUTCHours(-3)
    if (timePeriod.value === 'MONTHLY') {
      today.setMonth(today.getMonth() + 1)
      const lastYearToday = new Date(today)
      lastYearToday.setHours(today.getHours() - 3)
      lastYearToday.setFullYear(today.getFullYear() - 1)

      const prismaAlerts = await this.prisma.alert.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        where: {
          AND: [{ createdAt: { lt: today } }, { createdAt: { gt: lastYearToday } }],
        },
        include: {
          alarm: true,
          stationParameter: {
            include: {
              parameter: true,
              station: true,
            },
          },
        },
      })

      const entityAlerts = prismaAlerts.map(PrismaAlertMapper.toEntity)

      const countByTimePeriod: {
        criticalCount: number
        warningCount: number
        time: string
      }[] = []
      const countBytTimePeriodDate = new Date(lastYearToday)
      countBytTimePeriodDate.setDate(1)

      for (let i = 0; i < 12; i++) {
        countByTimePeriod.push({
          criticalCount: 0,
          warningCount: 0,
          time: countBytTimePeriodDate.toISOString().split('T')[0],
        })

        countBytTimePeriodDate.setMonth(countBytTimePeriodDate.getMonth() + 1)
      }

      entityAlerts.forEach((alert) => {
        const alertCreatedAt = alert.createdAt.value

        alertCreatedAt.setDate(1)
        const count = countByTimePeriod.find(
          (c) => c.time === alertCreatedAt.toISOString().split('T')[0],
        )

        if (count) {
          if (alert.level.value === 'CRITICAL') {
            count.criticalCount += 1
          } else if (alert.level.value === 'WARNING') {
            count.warningCount += 1
          }
        }
      })

      return countByTimePeriod
    } else {
      today.setDate(today.getDate() + 1)
      const lastWeekToday = new Date(today)
      lastWeekToday.setDate(lastWeekToday.getDate() - 6)

      const prismaAlerts = await this.prisma.alert.findMany({
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          AND: [{ createdAt: { gte: lastWeekToday } }, { createdAt: { lte: today } }],
        },
        include: {
          alarm: true,
          stationParameter: {
            include: {
              parameter: true,
              station: true,
            },
          },
        },
      })

      const entityAlerts = prismaAlerts.map(PrismaAlertMapper.toEntity)
      const countByTimePeriod: {
        criticalCount: number
        warningCount: number
        time: string
      }[] = []
      const countBytTimePeriodDate = new Date(lastWeekToday)

      for (let i = 0; i < 7; i++) {
        countByTimePeriod.push({
          criticalCount: 0,
          warningCount: 0,
          time: countBytTimePeriodDate.toISOString().split('T')[0],
        })

        countBytTimePeriodDate.setDate(countBytTimePeriodDate.getDate() + 1)
      }

      entityAlerts.forEach((alert) => {
        const alertCreatedAt = alert.createdAt.value

        const count = countByTimePeriod.find(
          (c) => c.time === alertCreatedAt.toISOString().split('T')[0],
        )

        if (count) {
          if (alert.level.value === 'CRITICAL') {
            count.criticalCount += 1
          } else if (alert.level.value === 'WARNING') {
            count.warningCount += 1
          }
        }
      })

      return countByTimePeriod
    }
  }

  async countAlertsCriticalByStationParameterId(stationId: Id): Promise<Integer> {
    const count = await this.prisma.alert.count({
      where: {
        stationParameter: {
          stationId: stationId.value,
        },
        alarm: {
          level: 'CRITICAL',
        },
      },
    })

    return Integer.create(count)
  }

  async countAlertsWarningByStationParameterId(stationId: Id): Promise<Integer> {
    const count = await this.prisma.alert.count({
      where: {
        stationParameter: {
          stationId: stationId.value,
        },
        alarm: {
          level: 'WARNING',
        },
      },
    })

    return Integer.create(count)
  }
}
