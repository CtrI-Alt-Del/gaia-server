import { Id } from '@/core/global/domain/structures'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Station } from '@/core/telemetry/domain/entities/station'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'

type Request = {
  stationDto: StationDto
  parameterIds: string[]
}

export class CreateStationUseCase implements UseCase<Request, StationDto> {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly parametersRepository: ParametersRepository,
  ) {}

  async execute({ stationDto, parameterIds }: Request): Promise<StationDto> {
    const stationParameterIds = await this.findParametersByIds(parameterIds)
    const station = Station.create({
      name: stationDto.name,
      uid: stationDto.uid,
      address: stationDto.address,
      latitude: stationDto.latitude,
      longitude: stationDto.longitude,
      quantityOfParameters: stationParameterIds.length,
      lastReadAt: null,
    })
    await this.stationsRepository.add(station, stationParameterIds)
    return station.dto
  }
  async findParametersByIds(parameterIds: string[]): Promise<Id[]> {
    const stationParameterIds = parameterIds.map((id) => Id.create(id))
    const parameters = await this.parametersRepository.findManyByIds(stationParameterIds)
    if (parameters.length !== stationParameterIds.length) {
      throw new ParameterNotFoundError()
    }
    return stationParameterIds
  }
}
