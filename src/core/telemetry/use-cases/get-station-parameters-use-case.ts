import { Id } from '@/core/global/domain/structures'
import {
  ParametersRepository,
  StationsRepository,
  UseCase,
} from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'
import { Station } from '@/core/telemetry/domain/entities/station'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'

type Request = {
  stationId: string
}
export class GetStationParametersUseCase implements UseCase<Request, ParameterDto[]> {
  constructor(
    private readonly stationRepository: StationsRepository,
    private readonly parametersRepository: ParametersRepository,
  ) {}

  async execute(params: Request): Promise<ParameterDto[]> {
    const station = await this.findById(Id.create(params.stationId))
    return this.findParametersByStationId(station.id)
  }
  async findById(stationId: Id): Promise<Station> {
    const station = await this.stationRepository.findById(stationId)
    if (!station) {
      throw new StationNotFoundError()
    }
    return station
  }
  async findParametersByStationId(stationId: Id): Promise<ParameterDto[]> {
    const parameters =
      await this.parametersRepository.findParametersByStationId(stationId)
    return parameters.map((parameter) => parameter.dto)
  }
}
