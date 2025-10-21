import { Inject, Param, Patch } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { AlertsController } from './alerts.controller'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { ReadAlertUseCase } from '@/core/alerting/use-cases/read-alert-use-case'
import { DEPENDENCIES } from '@/infra/constants'
import { CacheProvider } from '@/core/global/interfaces'

@AlertsController('/:alertId')
export class ReadAlertController {
  constructor(
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly repository: AlertsRepository,
    @Inject(DEPENDENCIES.provision.cacheProvider)
    private readonly cacheProvider: CacheProvider,
  ) {}

  @Patch()
  async handle(@Param('alertId') alertId: string) {
    const useCase = new ReadAlertUseCase(this.repository, this.cacheProvider)
    return await useCase.execute(alertId)
  }
}
