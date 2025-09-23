import { Station } from '@/core/telemetry/domain/entities/station'
import type { PrismaStation } from '../types'
import { PrismaParameterMapper } from '@/infra/database/prisma/mappers/prisma-parameter-mapper'
import type Prisma from '@prisma/client'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { StationWithCount } from '@/core/global/types'

type PrismaStationWithRelations = Prisma.Station & {
  stationParameter: (Prisma.StationParameter & {
    parameter: Prisma.Parameter
  })[]
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

  static toPrisma(station: Station): PrismaStation {
    const parameterItems = station.parameters.items
    return {
      id: station.id.value,
      uid: station.uid.value.value,
      name: station.name.value,
      latitude: station.coordinate.latitude.value,
      longitude: station.coordinate.longitude.value,
      address: station.adddress.value,
      isActive: station.isActive.value,
      createdAt: station.createdAt.value,
      updatedAt: station.createdAt.value,
      stationParameter: {
        create: parameterItems.map((param) => ({
          parameter: {
            connect: { id: param.id.value },
          },
        })),
      },
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
      parameters: prismaStation.stationParameter
        ? prismaStation.stationParameter.map((join) =>
            PrismaParameterMapper.toDto(join.parameter),
          )
        : [],
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
      _count: prismaStation._count,
    }
  }
}
