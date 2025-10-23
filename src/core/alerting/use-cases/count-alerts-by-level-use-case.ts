import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { AlarmLevel } from '../domain/structures'

export class CountAlertsByLevelUseCase {
  constructor(private readonly alertsRepository: AlertsRepository) {}

  async execute(): Promise<{ warningAlerts: number; criticalAlerts: number }> {
    const [warningAlerts, criticalAlerts] = await Promise.all([
      this.alertsRepository.countByAlarmLevel(AlarmLevel.createAsWarning()),
      this.alertsRepository.countByAlarmLevel(AlarmLevel.createAsCritical()),
    ])
    return {
      warningAlerts,
      criticalAlerts,
    }
  }
}
