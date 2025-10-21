import { Inject, Param, Patch } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { AlertsController } from './alerts.controller'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { ReadAlertUseCase } from '@/core/alerting/use-cases/read-alert-use-case'

@AlertsController('/:alertId')
export class ReadAlertController {
  constructor(
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly repository: AlertsRepository,
  ) {}

  @Patch()
  async handle(@Param('alertId') alertId: string) {
    const useCase = new ReadAlertUseCase(this.repository)
    return await useCase.execute(alertId)
  }
}
