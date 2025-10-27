import { Processor, Process } from '@nestjs/bull'

import { ReadingsCollectedEvent } from '@/core/telemetry/domain/events'

import { DEPENDENCIES } from '@/infra/constants'
import { ParseReadingsJob } from '../../telemetry/jobs'

@Processor(DEPENDENCIES.queue.telemetryQueue)
export class BullTelemetryProcessor {
  constructor(private readonly parseReadingsJob: ParseReadingsJob) {}

  @Process(ReadingsCollectedEvent._NAME)
  async processReadingsCollectedEvent() {
    await this.parseReadingsJob.handle()
  }
}
