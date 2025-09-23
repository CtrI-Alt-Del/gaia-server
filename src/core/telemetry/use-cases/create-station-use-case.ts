import { Id } from '@/core/global/domain/structures'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Station } from '@/core/telemetry/domain/entities/station'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'

type Request = {
  name: string
  uid: string
  latitude: number
  longitude: number
  parameterIds: string[]
  address: string
}

export class CreateStationUseCase implements UseCase<Request, StationDto> {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly parametersRepository: ParametersRepository,
  ) {}

  async execute(data: Request): Promise<StationDto> {
    const station = Station.create({
      name: data.name,
      uid: data.uid,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      parameters: await this.findParametersByIds(data.parameterIds),
    })
    await this.stationsRepository.add(station)
    return station.dto
  }
  async findParametersByIds(ids: string[]): Promise<ParameterDto[]> {
    const parameters = await this.parametersRepository.findManyByIds(ids.map(Id.create))
    if (parameters.length !== ids.length) {
      throw new ParameterNotFoundError()
    }
    return parameters.map((param) => param.dto)
  }
}
