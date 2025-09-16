import { Injectable } from '@nestjs/common'

import type { StationsRepository } from '@/core/global/interfaces'

import { PrismaRepository } from './prisma-repository'
import { Id } from '@/core/global/domain/structures'
import { Station } from '@/core/telemetry/domain/entities/station'
import { PrismaStationMapper } from '@/infra/database/prisma/mappers'

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
  async deleteById(id: Id): Promise<void> {
    await this.prisma.station.delete({
      where: { id: id.value },
    })
  }
}
