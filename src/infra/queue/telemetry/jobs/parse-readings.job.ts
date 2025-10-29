import { Inject, Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { Broker, StationsRepository } from '@/core/global/interfaces'

import { ReadingsRepository } from '@/core/telemetry/interfaces'
import { MeasurementsRepository } from '@/core/telemetry/interfaces/measurements-repository'
import { ParametersRepository } from '@/core/telemetry/interfaces/parameters-repository'
import { ParseReadingsUseCase } from '@/core/telemetry/use-cases'

import { DEPENDENCIES } from '@/infra/constants'
import { DatabaseModule } from '@/infra/database/database.module'

@Injectable()
export class ParseReadingsJob {
  constructor(
    @Inject(DEPENDENCIES.queue.alertingBroker)
    private readonly broker: Broker,
    @Inject(DatabaseModule.READINGS_REPOSITORY)
    private readonly readingsRepository: ReadingsRepository,
    @Inject(DatabaseModule.MEASUREMENTS_REPOSITORY)
    private readonly measurementsRepository: MeasurementsRepository,
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handle() {
    const useCase = new ParseReadingsUseCase(
      this.broker,
      this.readingsRepository,
      this.measurementsRepository,
      this.parametersRepository,
      this.stationsRepository,
    )
    try {
      await useCase.execute()
    } catch (error) {
      console.error(error)
    }
  }
}
