import { StationsRepository } from '@/core/global/interfaces'

export class CountStationsUseCase {
  constructor(private readonly stationsRepository: StationsRepository) {}

  async execute(): Promise<{ totalStations: number; activeStationsPercentage: number }> {
    const [totalStations, activeStations] = await Promise.all([
      this.stationsRepository.countAll(),
      this.stationsRepository.countActive(),
    ])

    const activeStationsPercentage =
      totalStations > 0 ? (activeStations / totalStations) * 100 : 0

    return {
      totalStations,
      activeStationsPercentage,
    }
  }
}
