import { Event } from '@/core/global/domain/abstracts'

export class ReadingsCollectedEvent extends Event {
  static readonly _NAME = 'telemetry/readings.collected'

  constructor() {
    super(ReadingsCollectedEvent._NAME, {})
  }
}
