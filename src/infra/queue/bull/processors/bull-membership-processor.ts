import { Job } from 'bull'
import { Processor, Process } from '@nestjs/bull'

import { EventPayload } from '@/core/global/domain/types/event-payload'
import { UserCreatedEvent } from '@/core/membership/domain/events/user-created-event'

import { DEPENDENCIES } from '@/infra/constants'
import { CreateAccountJob } from '../../auth/jobs'

@Processor(DEPENDENCIES.queue.authQueue)
export class BullMembershipProcessor {
  constructor(private readonly createAccountJob: CreateAccountJob) {}

  @Process(UserCreatedEvent._NAME)
  async processUserCreatedEvent(job: Job<EventPayload<typeof UserCreatedEvent>>) {
    await this.createAccountJob.handle(job.data)
  }
}
