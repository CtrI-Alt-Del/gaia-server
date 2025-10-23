import { Inject, Injectable } from '@nestjs/common'

import { Broker } from '@/core/global/interfaces'

import { DEPENDENCIES } from '@/infra/constants'
import { Cron, CronExpression } from '@nestjs/schedule'
import { MeasurementCreatedEvent } from '@/core/telemetry/domain/events'

@Injectable()
export class ParseMeasurementsJob {
  constructor(
    @Inject(DEPENDENCIES.queue.telemetryBroker)
    private readonly broker: Broker,
  ) {}

  @Cron(CronExpression.EVERY_30_MINUTES)
  async handle() {
    const event = new MeasurementCreatedEvent({
      measurementValue: 55.5,
      stationParameterId: 'cmgxzb7xt03upv2rv5ditfzve',
    })
    await this.broker.publish(event)
  }
}
