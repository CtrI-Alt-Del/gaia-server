import { StationsRepository } from '@/core/global/interfaces'
import { AlarmsRepository } from '@/core/alerting/interfaces'
import { DashboardSummaryResponseDto } from '@/infra/rest/dashboard/dtos/dashboard-summary.dto'

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly alarmsRepository: AlarmsRepository,
  ) {}

  async execute(): Promise<DashboardSummaryResponseDto> {
    const totalStations = await this.stationsRepository.countAll()
    const activeStations = await this.stationsRepository.countActive()
    console.log('[Dashboard] totalStations:', totalStations)
    console.log('[Dashboard] activeStations:', activeStations)
    const activeStationsPercentage = totalStations > 0 ? Math.round((activeStations / totalStations) * 100) : 0

    const warningAlerts = await this.alarmsRepository.countByLevel('warning')
    const criticalAlerts = await this.alarmsRepository.countByLevel('critical')

    return {
      totalStations,
      activeStationsPercentage,
      warningAlerts,
      criticalAlerts,
    }
  }
}
