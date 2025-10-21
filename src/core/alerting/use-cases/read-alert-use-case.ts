import { AlertsRepository, UseCase } from '@/core/global/interfaces'
import { Id } from '@/core/global/domain/structures'

import { AlertDto } from '../dtos/alert-dto'
import { AlertNotFoundError } from '../domain/errors'
import { Alert } from '../domain/entities'

export class ReadAlertUseCase implements UseCase<string, AlertDto> {
  constructor(private readonly repository: AlertsRepository) {}

  async execute(alertId: string): Promise<AlertDto> {
    const alert = await this.findAlert(Id.create(alertId))
    alert.read()
    await this.repository.replace(alert)
    return alert.dto
  }

  private async findAlert(alertId: Id): Promise<Alert> {
    const alert = await this.repository.findById(alertId)
    if (!alert) {
      throw new AlertNotFoundError()
    }
    return alert
  }
}
