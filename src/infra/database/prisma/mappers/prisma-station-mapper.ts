import { Station } from '@/core/telemetry/domain/entities/station'
import type { PrismaStation } from '../types'
import { PrismaParameterMapper } from '@/infra/database/prisma/mappers/prisma-parameter-mapper'
import type Prisma from '@prisma/client'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'

type PrismaStationWithRelations = Prisma.Station & {
  stationParameter: (Prisma.StationParameter & {
    parameter: Prisma.Parameter
  })[]
}
export class PrismaStationMapper {
  static toEntity(prismaStation: PrismaStationWithRelations): Station {
    return Station.create(PrismaStationMapper.toDto(prismaStation))
  }

  static toPrisma(station: Station): PrismaStation {
    const parameterItems = station.parameters.items
    return {
      id: station.id.value,
      code: station.UID.value.value,
      name: station.name.value,
      latitude: station.location.latitude.value,
      longitude: station.location.longitude.value,
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
      UID: prismaStation.code,
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
}
