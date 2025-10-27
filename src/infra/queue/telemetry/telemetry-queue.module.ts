import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { DatabaseModule } from '@/infra/database/database.module'
import { BullTelemetryBroker } from '../bull/brokers'
import { ParseReadingsJob } from './jobs/parse-readings.job'
import { DEPENDENCIES } from '@/infra/constants'
import { BullTelemetryProcessor } from '../bull/processors'

@Module({
  imports: [
    BullModule.registerQueue({
      name: DEPENDENCIES.queue.telemetryQueue,
    }),
    DatabaseModule,
  ],
  providers: [
    BullTelemetryProcessor,
    {
      provide: DEPENDENCIES.queue.telemetryBroker,
      useClass: BullTelemetryBroker,
    },
    ParseReadingsJob,
  ],
  exports: [DEPENDENCIES.queue.telemetryBroker],
})
export class TelemetryQueueModule {}
