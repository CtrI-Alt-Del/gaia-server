import { Id } from '@/core/global/domain/structures'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { Station } from '@/core/telemetry/domain/entities/station'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'

type Request = {
  name: string
  UID: string
  latitude: number
  longitude: number
  parameters: string[]
  address: string
}
type UseCaseInput = { data: Partial<Request>; stationId: string }

export class UpdateStationUseCase implements UseCase<UseCaseInput, StationDto> {
  constructor(
    private readonly parametersRepository: ParametersRepository,
    private readonly stationsRepository: StationsRepository,
  ) {}

  async execute({ stationId: id, data }: UseCaseInput): Promise<StationDto> {
    const existingStation = await this.findStationById(Id.create(id))
    const updatedParameters = data.parameters
      ? await this.findParametersByIds(data.parameters)
      : existingStation.parameters.map((param) => param.dto).items
    const updatedStation = existingStation.update({
      name: data.name,
      UID: data.UID,
      latitude: data.latitude,
      longitude: data.longitude,
      parameters: updatedParameters,
      address: data.address,
    })
    await this.stationsRepository.replace(updatedStation)
    return updatedStation.dto
  }
  async findStationById(id: Id): Promise<Station> {
    const station = await this.stationsRepository.findById(id)
    if (!station) {
      throw new StationNotFoundError()
    }
    return station
  }
  async findParametersByIds(ids: string[]): Promise<ParameterDto[]> {
    if (ids.length === 0) {
      return []
    }
    const parameters = await this.parametersRepository.findManyByIds(ids.map(Id.create))
    if (parameters.length !== ids.length) {
      throw new ParameterNotFoundError()
    }
    return parameters.map((param) => param.dto)
  }
}
