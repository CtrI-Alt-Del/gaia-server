import { StationsRepository } from '../interfaces/stations-repository'
import { UseCase } from '@/core/global/interfaces'
import { StationDto } from '../domain/dtos/station-dto'

type Request = {
  lat1: number
  long1: number
  lat2: number
  long2: number
}

export class ListStationsByCoordsUseCase implements UseCase<Request, StationDto[]> {
  constructor(private readonly repository: StationsRepository) {}

  async execute(params: Request): Promise<StationDto[]> {
    const stations = await this.repository.findManyByFourCoords({
      lat1: params.lat1,
      long1: params.long1,
      lat2: params.lat2,
      long2: params.long2,
    })

    return stations.map((station) => station.dto)
  }
}
