import { Injectable } from '@nestjs/common'

import { CursorPagination, Id, Timestamp } from '@/core/global/domain/structures'
import { Measurement } from '@/core/telemetry/domain/entities/measurement'
import { MeasurementListParams } from '@/core/global/types/measurement-list-params'
import { MeasurementsRepository } from '@/core/telemetry/interfaces/measurements-repository'
import { PrismaRepository } from './prisma-repository'
import { PrismaMeasurementMapper } from '../mappers/prisma-measurement-mapper'

@Injectable()
export class PrismaMeasurementsRepository
  extends PrismaRepository
  implements MeasurementsRepository
{
  async findMany({
    pageSize,
    nextCursor,
    previousCursor,
    status,
    date,
    parameterId,
    stationId,
  }: MeasurementListParams): Promise<CursorPagination<Measurement>> {
    const whereClause = {
      ...(status?.isAll.isTrue ? {} : { isActive: status?.isActive.isTrue }),
      ...(date ? { createdAt: this.createDateQuery(date) } : {}),
      ...(stationId
        ? { stationParameter: { stationId: { equals: stationId.value } } }
        : {}),
      ...(stationId && parameterId && parameterId.value !== 'all'
        ? {
            AND: [
              { stationParameter: { stationId: { equals: stationId.value } } },
              { stationParameter: { parameterId: { equals: parameterId.value } } },
            ],
          }
        : {}),
    }

    const include = {
      stationParameter: {
        include: {
          parameter: true,
          station: true,
        },
      },
    }

    const query = this.createPaginationQuery(
      this.prisma.measurement,
      whereClause,
      undefined,
      undefined,
      include,
    )

    const result = await this.paginateWithCursor<any>(query, {
      nextCursor,
      previousCursor,
      pageSize,
    })

    return result.map(PrismaMeasurementMapper.toEntity)
  }

  async createMany(measurements: Measurement[]): Promise<void> {
    await this.prisma.measurement.createMany({
      data: measurements.map((measurement) => ({
        value: measurement.value.value,
        createdAt: measurement.createdAt.value,
        stationParameterId: measurement.parameter.id.value,
      })),
    })
  }

  async findManyMeasurementsByStationId(stationId: Id): Promise<Measurement[]> {
    const result = await this.prisma.measurement.findMany({
      where: {
        stationParameter: { stationId: { equals: stationId.value } },
      },
      orderBy: { id: 'desc' },
      include: {
        stationParameter: {
          include: {
            parameter: true,
            station: true,
          },
        },
      },
    })

    return result.map(PrismaMeasurementMapper.toEntity)
  }

  async getMonthlyAverageByStationParameter(
    stationId: Id,
    parameterId: Id,
    month: Timestamp,
  ): Promise<number> {
    const reference = month.value
    const startOfMonth = new Date(reference.getFullYear(), reference.getMonth(), 1)
    const endOfMonth = new Date(
      reference.getFullYear(),
      reference.getMonth() + 1,
      0,
      23,
      59,
      59,
      999,
    )

    const aggregate = await this.prisma.measurement.aggregate({
      _avg: { value: true },
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        stationParameter: {
          id: { equals: parameterId.value },
          stationId: { equals: stationId.value },
        },
      },
    })

    return aggregate._avg.value ?? 0
  }
}
