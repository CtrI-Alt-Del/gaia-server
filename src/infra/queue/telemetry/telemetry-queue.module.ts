import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'

import { DatabaseModule } from '@/infra/database/database.module'
import { BullTelemetryBroker } from '../bull/brokers'
import { ParseMeasurementsJob } from './jobs/parse-measurements.job'
import { DEPENDENCIES } from '@/infra/constants'

@Module({
  imports: [
    BullModule.registerQueue({
      name: DEPENDENCIES.queue.telemetryQueue,
    }),
    DatabaseModule,
  ],
  providers: [
    {
      provide: DEPENDENCIES.queue.telemetryBroker,
      useClass: BullTelemetryBroker,
    },
    ParseMeasurementsJob,
  ],
  exports: [DEPENDENCIES.queue.telemetryBroker],
})
export class TelemetryQueueModule {}
