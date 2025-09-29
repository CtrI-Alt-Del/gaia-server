import { Id } from '@/core/global/domain/structures'
import { StationsRepository, UseCase } from '@/core/global/interfaces'
import { Station } from '@/core/telemetry/domain/entities/station'
import { StationAlreadyActivatedError } from '@/core/telemetry/domain/errors/station-already-activated-error'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'

type Request = {
  id: string
}

export class ActivateStationUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: StationsRepository) {}

  async execute(stationDto: Request): Promise<void> {
    const station = await this.findById(Id.create(stationDto.id))

    if (station.isActive.isTrue) {
      throw new StationAlreadyActivatedError()
    }

    station.activate()

    await this.repository.replace(station, [])
  }

  async findById(id: Id): Promise<Station> {
    const station = await this.repository.findById(id)
    if (!station) throw new StationNotFoundError()
    return station
  }
}
