import { MeasurementRepository } from '@/core/telemetry/interfaces/measurement-repository'
import { PrismaRepository } from './prisma-repository'
import { CursorPagination } from '@/core/global/domain/structures'
import { MeasurementListParams } from '@/core/global/types/measurement-list-params'
import { Measurement } from '@/core/telemetry/domain/entities/measurement'
import { Injectable } from '@nestjs/common'
import { PrismaMeasurementMapper } from '../mappers/prisma-measurement-mapper'
import { Prisma } from '@prisma/client'

@Injectable()
export class PrismaMeasurementsRepository
  extends PrismaRepository
  implements MeasurementRepository
{
  private readonly _include = {
    stationParameter: {
      include: {
        parameter: true,
        station: true,
      },
    },
  }
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
      ...(date ? { createdAt: { equals: date.value } } : {}),
      ...(parameterId
        ? { stationParameter: { parameterId: { equals: parameterId.value } } }
        : {}),
      ...(stationId
        ? { stationParameter: { stationId: { equals: stationId.value } } }
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
      this.prisma.measure,
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

  async createMany(measurements: Measurement[]): Promise<Measurement[]> {
    const operations: Prisma.PrismaPromise<any>[] = []

    for (const measurement of measurements) {
      const stationParam = await this.findStationParameter(measurement)

      if (!stationParam) {
        console.error(
          `Falha ao encontrar StationParameter para stationId ${measurement.stationId} e parameterId ${measurement.parameterId}. Medição será pulada.`,
        )
        continue
      }

      const data = this.mapToPrismaInput(measurement, stationParam.id)

      const operation = this.prisma.measure.create({
        data,
        include: this._include,
      })
      operations.push(operation)
    }

    if (operations.length === 0) {
      console.log('Nenhuma medição válida para criar após a verificação.')
      return []
    }

    const createdMeasures = await this.prisma.$transaction(operations)

    return createdMeasures.map(PrismaMeasurementMapper.toEntity)
  }
  async create(measurement: Measurement): Promise<Measurement> {
    const stationParam = await this.findStationParameter(measurement)
    if (!stationParam) {
      throw new Error(
        `Falha ao encontrar StationParameter para stationId ${measurement.stationId} e parameterId ${measurement.parameterId}`,
      )
    }
    const data = PrismaMeasurementMapper.toPrisma(measurement)
    const createdMeasure = await this.prisma.measure.create({
      data,
      include: this._include,
    })
    return PrismaMeasurementMapper.toEntity(createdMeasure)
  }
  private async findStationParameter(measurement: Measurement) {
    return this.prisma.stationParameter.findFirst({
      where: {
        stationId: measurement.stationId.value,
        parameterId: measurement.parameterId.value,
      },
      select: {
        id: true,
      },
    })
  }
  private mapToPrismaInput(
    measurement: Measurement,
    stationParameterId: string,
  ): Prisma.MeasureCreateInput {
    return {
      id: measurement.id.value,
      value: measurement.value.value,
      unitOfMeasure: measurement.unitOfMeasure.value,
      createdAt: measurement.createdAt.value,
      stationParameter: {
        connect: {
          id: stationParameterId,
        },
      },
    }
  }
}
