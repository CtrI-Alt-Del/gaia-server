import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'

import { Event } from '@/core/global/domain/abstracts'
import { Broker } from '@/core/global/interfaces/broker'
import { DEPENDENCIES } from '@/infra/constants'

@Injectable()
export class BullMembershipBroker implements Broker {
  constructor(
    @InjectQueue(DEPENDENCIES.queue.membershipQueue)
    private readonly membershipQueue: Queue,
  ) {}

  async publish(event: Event): Promise<void> {
    await this.membershipQueue.add(event.name, event.payload)
  }
}
