import { Inject, Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'

import { MeasurementCreatedEvent } from '@/core/telemetry/domain/events'
import { AlarmsRepository } from '@/core/alerting/interfaces'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { CreateAlertUseCase } from '@/core/alerting/use-cases/create-alert-use-case'
import { EventPayload } from '@/core/global/domain/types/event-payload'
import { CacheProvider } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { DEPENDENCIES } from '@/infra/constants/dependencies'
import { CACHE } from '@/infra/constants'

type Payload = EventPayload<typeof MeasurementCreatedEvent>

@Injectable()
export class CreateAlertJob {
  constructor(
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly alarmsRepository: AlarmsRepository,
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly alertsRepository: AlertsRepository,
    @Inject(DEPENDENCIES.provision.cacheProvider)
    private readonly cacheProvider: CacheProvider,
  ) {}

  @OnEvent(MeasurementCreatedEvent._NAME)
  async handle(payload: Payload) {
    const useCase = new CreateAlertUseCase(this.alarmsRepository, this.alertsRepository)
    await useCase.execute({
      measurementValue: payload.measurementValue,
      stationParameterId: payload.stationParameterId,
    })
    await this.cacheProvider.clear(CACHE.lastAlerts.key)
  }
}
