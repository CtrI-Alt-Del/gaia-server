import { StationsRepository } from '@/core/global/interfaces'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { DashboardSummaryResponseDto } from '@/infra/rest/dashboard/dtos/dashboard-summary.dto'

export class GetDashboardSummaryUseCase {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly alertsRepository: AlertsRepository,
  ) {}

  async execute(): Promise<DashboardSummaryResponseDto> {
    const totalStations = await this.stationsRepository.countAll()
    const activeStations = await this.stationsRepository.countActive()
    console.log('[Dashboard] totalStations:', totalStations)
    console.log('[Dashboard] activeStations:', activeStations)
    const activeStationsPercentage = totalStations > 0 ? (activeStations / totalStations) * 100 : 0

    const warningAlerts = await this.alertsRepository.countByLevel('WARNING')
    const criticalAlerts = await this.alertsRepository.countByLevel('CRITICAL')

    return {
      totalStations,
      activeStationsPercentage,
      warningAlerts,
      criticalAlerts,
    }
  }
}
