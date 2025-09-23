import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'

import { Event } from '@/core/global/domain/abstracts'
import { EventBroker } from '@/core/global/interfaces/event-broker'

@Injectable()
export class NestEventBroker implements EventBroker {
  constructor(private eventEmitter: EventEmitter2) {}

  async publish(event: Event): Promise<void> {
    this.eventEmitter.emit(event.name, event.payload)
  }
}
