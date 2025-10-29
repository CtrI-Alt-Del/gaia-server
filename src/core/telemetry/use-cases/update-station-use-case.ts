import { Id } from '@/core/global/domain/structures'
import { UseCase } from '@/core/global/interfaces'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Station } from '@/core/telemetry/domain/entities/station'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'
import { ParametersRepository } from '../interfaces/parameters-repository'
import { StationsRepository } from '../interfaces/stations-repository'

type Request = {
  stationId: string
  stationDto: Partial<StationDto>
  parameterIds: string[]
}

export class UpdateStationUseCase implements UseCase<Request, StationDto> {
  constructor(
    private readonly parametersRepository: ParametersRepository,
    private readonly stationsRepository: StationsRepository,
  ) {}

  async execute({
    stationId: id,
    stationDto,
    parameterIds,
  }: Request): Promise<StationDto> {
    const existingStation = await this.findStationById(Id.create(id))
    const updatedParametersIds = await this.findParametersByIds(parameterIds)

    const updatedStation = existingStation.update({
      name: stationDto.name,
      uid: stationDto.uid,
      latitude: stationDto.latitude,
      longitude: stationDto.longitude,
      address: stationDto.address,
    })

    await this.stationsRepository.replaceWithParameters(
      updatedStation,
      updatedParametersIds,
    )
    return updatedStation.dto
  }

  async findStationById(stationId: Id): Promise<Station> {
    const station = await this.stationsRepository.findById(stationId)
    if (!station) {
      throw new StationNotFoundError()
    }
    return station
  }

  async findParametersByIds(parametersIds: string[]): Promise<Id[]> {
    if (parametersIds.length === 0) {
      return []
    }
    const parameters = await this.parametersRepository.findManyByIds(
      parametersIds.map(Id.create),
    )
    if (parameters.length !== parametersIds.length) {
      throw new ParameterNotFoundError()
    }
    return parameters.map((param) => param.id)
  }
}
