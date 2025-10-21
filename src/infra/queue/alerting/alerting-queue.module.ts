import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { DatabaseModule } from '@/infra/database/database.module'
import { CreateAlertJob } from './jobs'
import { BullTelemetryProcessor } from '../bull/processors'
import { CacheProviderModule } from '@/infra/provision/cache/cache.porvider.module'

@Module({
  imports: [
    BullModule.registerQueue({
      name: AlertingQueueModule.ALERTING_QUEUE,
    }),
    DatabaseModule,
    CacheProviderModule,
  ],
  providers: [BullTelemetryProcessor, CreateAlertJob],
})
export class AlertingQueueModule {
  static readonly ALERTING_QUEUE = 'ALERTING_QUEUE'
}
