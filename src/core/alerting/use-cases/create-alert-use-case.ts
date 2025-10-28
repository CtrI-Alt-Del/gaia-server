import { Id, Numeric } from '@/core/global/domain/structures'
import { CacheProvider } from '@/core/global/interfaces'
import { AlertsRepository } from '../interfaces/alerts-repository'
import { AlarmsRepository } from '../interfaces'
import { CACHE } from '@/infra/constants'

type Request = {
  stationParameterId: string
  measurementValue: number
}

export class CreateAlertUseCase {
  constructor(
    private readonly alarmsRepository: AlarmsRepository,
    private readonly alertsRepository: AlertsRepository,
    private readonly cacheProvider: CacheProvider,
  ) {}

  async execute(request: Request): Promise<void> {
    const measurementValue = Numeric.create(request.measurementValue)
    const stationParameterId = Id.create(request.stationParameterId)

    const alarms =
      await this.alarmsRepository.findAllByStationParameter(stationParameterId)
    const promises: Promise<void>[] = []

    console.log({ alarms })

    for (const alarm of alarms) {
      const shouldCreateAlert = alarm.rule.apply(measurementValue)
      if (shouldCreateAlert.isTrue) {
        promises.push(
          this.alertsRepository.add(alarm.id, stationParameterId, measurementValue),
        )
      }
    }

    await Promise.all(promises)

    await this.cacheProvider.clear(CACHE.lastAlerts.key)
  }
}
