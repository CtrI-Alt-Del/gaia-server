import { Injectable } from '@nestjs/common'

import { StationsRepository } from '@/core/telemetry/interfaces'

import { PrismaRepository } from './prisma-repository'
import { CursorPagination, Id } from '@/core/global/domain/structures'
import { Station } from '@/core/telemetry/domain/entities/station'
import { PrismaStationMapper } from '@/infra/database/prisma/mappers'
import { StationsListingParams } from '@/core/global/types/stations-list-params'
import { StationFourCoordsParams } from '@/core/global/types/station-four-coords-params'

@Injectable()
export class PrismaStationsRepository
  extends PrismaRepository
  implements StationsRepository
{
  async add(station: Station, parametersIds: Id[]): Promise<void> {
    const prismaStation = PrismaStationMapper.toPrisma(station, parametersIds)
    await this.prisma.station.create({ data: prismaStation })
  }
  async findById(id: Id): Promise<Station | null> {
    const prismaStation = await this.prisma.station.findUnique({
      where: { id: id.value },
      include: {
        _count: {
          select: { stationParameter: true },
        },
        stationParameter: {
          include: {
            parameter: true,
          },
        },
      },
    })
    if (!prismaStation) {
      return null
    }
    return PrismaStationMapper.toEntity(prismaStation)
  }
  async replace(station: Station, parametersIds: Id[]): Promise<void> {
    const { stationParameter, ...stationData } = PrismaStationMapper.toPrisma(
      station,
      parametersIds,
    )

    if (stationParameter) {
      await this.prisma.$transaction([
        this.prisma.stationParameter.deleteMany({
          where: { stationId: station.id.value },
        }),
        this.prisma.station.update({
          where: { id: station.id.value },
          data: {
            ...stationData,
            stationParameter: { create: stationParameter.create },
          },
        }),
      ])
    }

    await this.prisma.station.update({
      where: { id: station.id.value },
      data: stationData,
    })
  }

  async findMany({
    nextCursor,
    previousCursor,
    pageSize,
    status,
    name,
  }: StationsListingParams): Promise<CursorPagination<Station>> {
    const whereClause = status?.isAll.isTrue
      ? undefined
      : { isActive: status?.isActive.isTrue }

    const where = {
      ...whereClause,
      name: { contains: name?.value, mode: 'insensitive' },
    }

    const query = this.createPaginationQuery(
      this.prisma.station,
      where,
      { id: 'desc' },
      undefined,
      {
        _count: {
          select: { stationParameter: true },
        },
      },
    )

    const result = await this.paginateWithCursor<any>(query, {
      nextCursor,
      previousCursor,
      pageSize,
    })

    return result.map(PrismaStationMapper.toEntity)
  }

  async findManyByFourCoords(coords: StationFourCoordsParams): Promise<Station[]> {
    const prismaStations = await this.prisma.station.findMany({
      where: {
        AND: [
          { latitude: { lt: Math.max(coords.lat1, coords.lat2) } },
          { latitude: { gt: Math.min(coords.lat1, coords.lat2) } },
          { longitude: { lt: Math.max(coords.long1, coords.long2) } },
          { longitude: { gt: Math.min(coords.long1, coords.long2) } },
        ],
      },
    })

    return await prismaStations.map(PrismaStationMapper.toEntity)
  }

  async countAll(): Promise<number> {
    return await this.prisma.station.count()
  }

  async countActive(): Promise<number> {
    return await this.prisma.station.count({ where: { isActive: true } })
  }
}
