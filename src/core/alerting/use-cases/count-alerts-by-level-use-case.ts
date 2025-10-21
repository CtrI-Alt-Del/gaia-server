import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'

export class CountAlertsByLevelUseCase {
  constructor(private readonly alertsRepository: AlertsRepository) {}

  async execute(): Promise<{ warningAlerts: number; criticalAlerts: number }> {
    const [warningAlerts, criticalAlerts] = await Promise.all([
      this.alertsRepository.countByLevel('WARNING'),
      this.alertsRepository.countByLevel('CRITICAL'),
    ])
    return {
      warningAlerts,
      criticalAlerts,
    }
  }
}
