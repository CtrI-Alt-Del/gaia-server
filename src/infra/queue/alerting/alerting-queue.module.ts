import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { CacheProviderModule } from '@/infra/provision/cache/cache.porvider.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CreateAlertJob } from './jobs'
import { BullAlertingProcessor } from '../bull/processors'

@Module({
  imports: [
    BullModule.registerQueue({
      name: AlertingQueueModule.ALERTING_QUEUE,
    }),
    DatabaseModule,
    CacheProviderModule,
  ],
  providers: [BullAlertingProcessor, CreateAlertJob],
})
export class AlertingQueueModule {
  static readonly ALERTING_QUEUE = 'ALERTING_QUEUE'
}
