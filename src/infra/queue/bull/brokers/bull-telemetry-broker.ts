import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'

import { Broker } from '@/core/global/interfaces/broker'
import { Event } from '@/core/global/domain/abstracts'

import { DEPENDENCIES } from '@/infra/constants'

@Injectable()
export class BullTelemetryBroker implements Broker {
  constructor(
    @InjectQueue(DEPENDENCIES.queue.telemetryQueue)
    private readonly telemetryQueue: Queue,
  ) {}

  async publish(event: Event): Promise<void> {
    await this.telemetryQueue.add(event.name, event.payload)
  }
}
