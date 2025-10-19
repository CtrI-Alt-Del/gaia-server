import { Injectable } from '@nestjs/common'

import type { AlertsRepository } from '@/core/global/interfaces'

import { Id } from '@/core/global/domain/structures'
import { Alert } from '@/core/alerting/domain/entities'
import { AlertListingParams } from '@/core/global/types/alerts-listing-params'
import { CursorPagination } from '@/core/global/domain/structures'

import { PrismaRepository } from './prisma-repository'
import { PrismaAlertMapper } from '../mappers'

@Injectable()
export class PrismaAlertsRepository extends PrismaRepository implements AlertsRepository {
  async countByLevel(level: 'WARNING' | 'CRITICAL'): Promise<number> {
    const count = await this.prisma.alert.count({
      where: {
        alarm: {
          level: {
            equals: level,
            mode: 'insensitive',
          },
        },
      },
    })
    return count
  }
  async add(alarmId: Id, measurementId: Id): Promise<void> {
    await this.prisma.alert.create({
      data: {
        alarmId: alarmId.value,
        measurementId: measurementId.value,
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
      ...(level
        ? { alarm: { level: { contains: level.value === 'all' ? '' : level.value } } }
        : {}),
    }

    const query = this.createPaginationQuery(
      this.prisma.alert,
      whereClause,
      undefined,
      undefined,
      {
        measurement: true,
        alarm: {
          include: {
            StationParameter: {
              include: {
                parameter: true,
                station: true,
              },
            },
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

  async findById(id: Id): Promise<Alert | null> {
    const prismaAlert = await this.prisma.alert.findUnique({
      where: { id: id.value },
      include: {
        measurement: true,
        alarm: {
          include: {
            StationParameter: {
              include: {
                parameter: true,
                station: true,
              },
            },
          },
        },
      },
    })

    if (!prismaAlert) {
      return null
    }

    return PrismaAlertMapper.toEntity(prismaAlert)
  }
}
