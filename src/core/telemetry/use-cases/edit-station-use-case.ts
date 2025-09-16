import { Id } from '@/core/global/domain/structures'
import type { StationsRepository, UseCase } from '@/core/global/interfaces'
import { StationDto } from '@/core/telemetry/domain/dtos/station-dto'
import { Station } from '@/core/telemetry/domain/entities/station'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'

type Request = {
  name: string
  UID: string
  latitude: number
  longitude: number
  address: string
}
type UseCaseInput = { data: Partial<Request>; stationId: string }

export class EditStationUseCase implements UseCase<UseCaseInput, StationDto> {
  constructor(
    private readonly stationsRepository: StationsRepository,
  ) {}

  async execute({ stationId: id, data }: UseCaseInput): Promise<StationDto> {
    const existingStation = await this.findStationById(Id.create(id))
    const updatedStation = existingStation.update({
      name: data.name,
      UID: data.UID,
      latitude: data.latitude,
      longitude: data.longitude,
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
}
