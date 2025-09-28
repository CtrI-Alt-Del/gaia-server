import type Prisma from '@prisma/client'

import { Station } from '@/core/telemetry/domain/entities/station'
import type { PrismaStation } from '../types'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { StationWithCount } from '@/core/global/types'
import { Id } from '@/core/global/domain/structures'

type PrismaStationWithRelations = Prisma.Station & {
  stationParameter: (Prisma.StationParameter & {
    parameter: Prisma.Parameter
  })[]
  _count: {
    stationParameter: number
  }
}

type PrismaStationWithCount = Prisma.Station & {
  _count: {
    stationParameter: number
  }
}
export class PrismaStationMapper {
  static toEntity(prismaStation: PrismaStationWithRelations): Station {
    return Station.create(PrismaStationMapper.toDto(prismaStation))
  }

  static toPrisma(station: Station, parametersIds: Id[]): PrismaStation {
    return {
      id: station.id.value,
      uid: station.uid.value.value,
      name: station.name.value,
      latitude: station.coordinate.latitude.value,
      longitude: station.coordinate.longitude.value,
      address: station.address.value,
      isActive: station.isActive.value,
      createdAt: station.createdAt.value,
      updatedAt: station.createdAt.value,
      stationParameter: parametersIds
        ? {
            create: parametersIds.map((paramId) => ({
              parameter: {
                connect: { id: paramId.value },
              },
            })),
          }
        : undefined,
    }
  }
  static toDto(prismaStation: PrismaStationWithRelations): StationDto {
    return {
      id: prismaStation.id,
      uid: prismaStation.uid,
      name: prismaStation.name,
      address: prismaStation.address,
      latitude: prismaStation.latitude,
      longitude: prismaStation.longitude,
      isActive: prismaStation.isActive,
      quantityOfParameters: prismaStation._count?.stationParameter ?? 0,
      lastReadAt: null,
      createdAt: prismaStation.createdAt,
      updatedAt: prismaStation.updatedAt,
    }
  }

  static toStationWithCount(prismaStation: PrismaStationWithCount): StationWithCount {
    return {
      id: prismaStation.id,
      uid: prismaStation.uid,
      name: prismaStation.name,
      latitude: prismaStation.latitude,
      longitude: prismaStation.longitude,
      address: prismaStation.address,
      isActive: prismaStation.isActive,
      createdAt: prismaStation.createdAt,
      updatedAt: prismaStation.updatedAt,
      quantityOfParameters: prismaStation._count.stationParameter,
      lastReadAt: null,
    }
  }
}
