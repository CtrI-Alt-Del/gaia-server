import { Inject, MessageEvent, Sse } from '@nestjs/common'
import { defer, map, Observable, repeat } from 'rxjs'

import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'

import { DatabaseModule } from '@/infra/database/database.module'
import { AlertsController } from './alerts.controller'
import { CACHE, DEPENDENCIES } from '@/infra/constants'
import { CacheProvider } from '@/core/global/interfaces'
import { AlertDto } from '@/core/alerting/dtos/alert-dto'

@AlertsController('/last')
export class GetLastAlertsController {
  constructor(
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly repository: AlertsRepository,
    @Inject(DEPENDENCIES.provision.cacheProvider)
    private readonly cacheProvider: CacheProvider,
  ) {}

  @Sse()
  async handle(): Promise<Observable<MessageEvent>> {
    return defer(async () => {
      let lastAlerts = await this.cacheProvider.get<AlertDto[]>(CACHE.lastAlerts.key)

      if (!lastAlerts) {
        const alerts = await this.repository.findLast()
        lastAlerts = alerts.map((alert) => alert.dto)
        await this.cacheProvider.set(CACHE.lastAlerts.key, lastAlerts)
      }

      return lastAlerts
    }).pipe(
      repeat({
        delay: 1000,
      }),
      map((lastAlerts) => ({
        type: 'last-alerts',
        data: lastAlerts,
      })),
    )
  }
}
