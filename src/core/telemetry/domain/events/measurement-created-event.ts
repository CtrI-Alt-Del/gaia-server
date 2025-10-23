import { Event } from '@/core/global/domain/abstracts'

type Payload = {
  measurementValue: number
  stationParameterId: string
}

export class MeasurementCreatedEvent extends Event<Payload> {
  static readonly _NAME = 'telemetry/measurement.created'

  constructor(readonly payload: Payload) {
    super(MeasurementCreatedEvent._NAME, payload)
  }
}
