import { Injectable } from '@nestjs/common'

import { CursorPagination } from '@/core/global/domain/structures'
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

    console.log(date?.value)

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
}
