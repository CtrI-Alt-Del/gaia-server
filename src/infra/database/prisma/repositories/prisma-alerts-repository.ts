import { Injectable } from '@nestjs/common'

import { AlertsRepository } from '@/core/alerting/interfaces'
import { Id, Numeric } from '@/core/global/domain/structures'
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
      ...(date ? { createdAt: { equals: date.value } } : {}),
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

  async countByTimePeriod(timePeriod: 'YEARLY' | 'WEEKLY'): Promise<{ count: number; time: string }[]> {
    const prismaAlerts = await this.prisma.alert.findMany({
      orderBy: {
        createdAt: "asc"
      },
      include: {
        alarm: true,
        stationParameter: {
          include: {
            parameter: true,
            station: true
          }
        }
      }
    })

    const entityAlerts = prismaAlerts.map(PrismaAlertMapper.toEntity)

    const countByTimePeriod:{count: number, time: string}[] = []
    
    if (timePeriod === "YEARLY") {
      entityAlerts.forEach(alert => {
        const year = alert.createdAt.value.getFullYear()

        const countTime = countByTimePeriod.find(i => Number(i.time).valueOf() === year)

        if (countTime) {
          countTime.count += 1
        } else {
          countByTimePeriod.push({count: 1, time: year.toString()})
        }
      })
    } else if(timePeriod === "WEEKLY") {
      entityAlerts.forEach(alert => {
        const alertCreatedAtDate = alert.createdAt.value

        if (countByTimePeriod.length === 0) {
          alertCreatedAtDate.setDate(alertCreatedAtDate.getDate() - alertCreatedAtDate.getDay())
          countByTimePeriod.push({count: 1, time: alertCreatedAtDate.toISOString().split("T")[0]})
        } else {
          const yearsWithAlert = countByTimePeriod.filter(i => Number(i.time.split("-")[0]).valueOf() === alertCreatedAtDate.getFullYear())
          if (yearsWithAlert.length > 0) {
            const monthWithAlert = yearsWithAlert.filter(i => Number(i.time.split("-")[1]).valueOf() === (alertCreatedAtDate.getMonth() + 1))
            if (monthWithAlert.length > 0) {
              const weekWithAlert = monthWithAlert.find(i => alertCreatedAtDate.getDate() - Number(i.time.split("-")[2]).valueOf() < 7)
              if (weekWithAlert) {
                weekWithAlert.count += 1
              } else {
                alertCreatedAtDate.setDate(alertCreatedAtDate.getDate() - alertCreatedAtDate.getDay())
                countByTimePeriod.push({count: 1, time: alertCreatedAtDate.toISOString().split("T")[0]})
              }
            } else {
              const firtsDayOfWeek = new Date(alertCreatedAtDate)
              firtsDayOfWeek.setDate(alertCreatedAtDate.getDate() - alertCreatedAtDate.getDay())
              const monthInEndWithAlert = countByTimePeriod.find(i => i.time === firtsDayOfWeek.toISOString().split("T")[0])
              if (monthInEndWithAlert) {
                monthInEndWithAlert.count += 1
              } else {
                countByTimePeriod.push({count: 1, time: firtsDayOfWeek.toISOString().split("T")[0]})
              }
            }
          } else {
            const firtsDayOfWeek = new Date(alertCreatedAtDate)
            firtsDayOfWeek.setDate(alertCreatedAtDate.getDate() - alertCreatedAtDate.getDay())
            const yearInEndWithAlert = countByTimePeriod.find(i => i.time === firtsDayOfWeek.toISOString().split("T")[0])
            if (yearInEndWithAlert) {
              yearInEndWithAlert.count += 1
            } else {
              alertCreatedAtDate.setDate(alertCreatedAtDate.getDate() - alertCreatedAtDate.getDay())
              countByTimePeriod.push({count: 1, time: alertCreatedAtDate.toISOString().split("T")[0]})
            }
          }
        }
      })
    }
    
    return await countByTimePeriod
  }
}
