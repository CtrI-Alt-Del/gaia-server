import { Injectable } from '@nestjs/common'

import type { StationsRepository } from '@/core/global/interfaces'

import { PrismaRepository } from './prisma-repository'
import { CursorPagination, Id } from '@/core/global/domain/structures'
import { Station } from '@/core/telemetry/domain/entities/station'
import { PrismaStationMapper } from '@/infra/database/prisma/mappers'
import { StationsListingParams } from '@/core/global/types/stations-list-params'
import { StationWithCount } from '@/core/global/types'
@Injectable()
export class PrismaStationsRepository
  extends PrismaRepository
  implements StationsRepository
{
  async add(station: Station): Promise<void> {
    const prismaStation = PrismaStationMapper.toPrisma(station)
    await this.prisma.station.create({ data: prismaStation })
  }
  async findById(id: Id): Promise<Station | null> {
    const prismaStation = await this.prisma.station.findUnique({
      where: { id: id.value },
      include: {
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
  async replace(station: Station): Promise<void> {
    const { stationParameter, ...stationData } = PrismaStationMapper.toPrisma(station)
    await this.prisma.$transaction([
      this.prisma.stationParameter.deleteMany({
        where: { stationId: station.id.value },
      }),
      this.prisma.station.update({
        where: { id: station.id.value },
        data: {
          ...stationData,
          ...(stationParameter && {
            stationParameter: { create: stationParameter.create },
          }),
        },
      }),
    ])
  }

  async findMany({
    nextCursor,
    previousCursor,
    pageSize,
    isActive,
    name,
  }: StationsListingParams): Promise<CursorPagination<StationWithCount>> {
    let stations: any[]
    let hasPreviousPage = false
    let hasNextPage = false

    if (nextCursor) {
      stations = await this.prisma.station.findMany({
        ...this.getNextCursorPaginationParams(nextCursor, pageSize),
        where: { isActive: isActive?.isTrue },
        include: {
          _count: {
            select: { stationParameter: true },
          },
        },
      })
      const result = this.getNextCursorPaginationResult(stations, pageSize)
      stations = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    } else if (previousCursor) {
      stations = await this.prisma.station.findMany({
        ...this.getPreviousCursorPaginationParams(previousCursor, pageSize),
        where: { isActive: isActive?.isTrue },
        include: {
          _count: {
            select: { stationParameter: true },
          },
        },
      })
      const result = this.getPreviousCursorPaginationResult(stations, pageSize)
      stations = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    } else {
      stations = await this.prisma.station.findMany({
        ...this.getInitialPaginationParams(pageSize),
        where: { isActive: isActive?.isTrue },
        include: {
          _count: {
            select: { stationParameter: true },
          },
        },
      })
      const result = this.getInitialPaginationResult(stations, pageSize)
      stations = result.items
      hasNextPage = result.hasNextPage
      hasPreviousPage = result.hasPreviousPage
    }

    const newNextCursor = this.getNewNextCursor(stations, hasNextPage)
    const newPrevCursor = this.getNewPreviousCursor(stations)

    return CursorPagination.create({
      items: stations,
      pageSize: pageSize.value,
      nextCursor: newNextCursor,
      previousCursor: newPrevCursor,
      hasNextPage,
      hasPreviousPage,
    })
  }
}
