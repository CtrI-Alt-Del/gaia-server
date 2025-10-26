import { Job } from 'bull'
import { Processor, Process } from '@nestjs/bull'

import { EventPayload } from '@/core/global/domain/types/event-payload'
import { MeasurementCreatedEvent } from '@/core/telemetry/domain/events'

import { DEPENDENCIES } from '@/infra/constants'
import { CreateAlertJob } from '../../alerting/jobs'

@Processor(DEPENDENCIES.queue.alertingQueue)
export class BullAlertingProcessor {
  constructor(private readonly createAlertJob: CreateAlertJob) {}

  @Process(MeasurementCreatedEvent._NAME)
  async processMeasurementCreatedEvent(
    job: Job<EventPayload<typeof MeasurementCreatedEvent>>,
  ) {
    await this.createAlertJob.handle(job.data)
  }
}
