import { Get, Inject, Param } from '@nestjs/common'

import { DatabaseModule } from '@/infra/database/database.module'
import { AlertsController } from './alerts.controller'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { CountAlertsByTimePeriod } from '@/core/alerting/use-cases'

@AlertsController('/count/:timePeriod')
export class CountAlertsByTimePeriodController {
  constructor(
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly repository: AlertsRepository,
  ) {}

  @Get()
  async handle(@Param("timePeriod") timePeriod: "YEARLY" | "WEEKLY") {
    const useCase = new CountAlertsByTimePeriod(this.repository)
    const result = await useCase.execute({timePeriod: timePeriod})
    return result
  }
}
