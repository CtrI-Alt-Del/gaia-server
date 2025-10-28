import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { CacheProviderModule } from '@/infra/provision/cache/cache.porvider.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { CreateAlertJob } from './jobs'
import { BullAlertingProcessor } from '../bull/processors'
import { DEPENDENCIES } from '@/infra/constants'
import { BullAlertingBroker } from '../bull/brokers'

@Module({
  imports: [
    BullModule.registerQueue({
      name: AlertingQueueModule.ALERTING_QUEUE,
    }),
    DatabaseModule,
    CacheProviderModule,
  ],
  providers: [
    BullAlertingProcessor,
    {
      provide: DEPENDENCIES.queue.alertingBroker,
      useClass: BullAlertingBroker,
    },
    CreateAlertJob,
  ],
  exports: [DEPENDENCIES.queue.alertingBroker],
})
export class AlertingQueueModule {
  static readonly ALERTING_QUEUE = 'ALERTING_QUEUE'
}
