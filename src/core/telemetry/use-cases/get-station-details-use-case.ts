import { Id } from '@/core/global/domain/structures'
import { StationsRepository } from '../interfaces/stations-repository'
import { UseCase } from '@/core/global/interfaces'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Station } from '@/core/telemetry/domain/entities/station'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'

type Request = {
  stationId: string
}
export class GetStationDetailsUseCase implements UseCase<Request, StationDto> {
  constructor(private readonly repository: StationsRepository) {}

  async execute(params: Request): Promise<StationDto> {
    const station = await this.findById(Id.create(params.stationId))
    return station.dto
  }
  async findById(stationId: Id): Promise<Station> {
    const station = await this.repository.findById(stationId)
    if (!station) {
      throw new StationNotFoundError()
    }
    return station
  }
}
