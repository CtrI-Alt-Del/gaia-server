import { Id } from '@/core/global/domain/structures'
import { StationsRepository } from '../interfaces/stations-repository'
import { UseCase } from '@/core/global/interfaces'
import { Station } from '@/core/telemetry/domain/entities/station'
import { StationAlreadyDeactivatedError } from '@/core/telemetry/domain/errors/station-already-deactivated-error'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'

type Request = {
  id: string
}

export class DeactivateStationUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: StationsRepository) {}

  async execute(stationId: Request): Promise<void> {
    const station = await this.findById(Id.create(stationId.id))

    if (station.isActive.isFalse) {
      throw new StationAlreadyDeactivatedError()
    }
    station.deactivate()
    await this.repository.replaceWithParameters(station, [])
  }

  async findById(id: Id): Promise<Station> {
    const station = await this.repository.findById(id)
    if (!station) throw new StationNotFoundError()
    return station
  }
}
