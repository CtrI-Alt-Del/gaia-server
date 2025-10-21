import { Get, Inject } from '@nestjs/common'

import { DatabaseModule } from '@/infra/database/database.module'
import { AlertsController } from './alerts.controller'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { CountAlertsByLevelUseCase } from '@/core/alerting/use-cases/count-alerts-by-level-use-case'

@AlertsController('/count')
export class CountAlertsByLevelController {
  constructor(
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly repository: AlertsRepository,
  ) {}

  @Get()
  async handle() {
    const useCase = new CountAlertsByLevelUseCase(this.repository)
    const result = await useCase.execute()
    return result
  }
}
