import { Inject, Injectable } from '@nestjs/common'

import { Broker } from '@/core/global/interfaces'

import { DEPENDENCIES } from '@/infra/constants'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ReadingsRepository } from '@/core/telemetry/interfaces'
import { MeasurementsRepository } from '@/core/telemetry/interfaces/measurements-repository'
import { ParametersRepository } from '@/core/telemetry/interfaces/parameters-repository'
import { DatabaseModule } from '@/infra/database/database.module'
import { ParseReadingsUseCase } from '@/core/telemetry/use-cases'

@Injectable()
export class ParseReadingsJob {
  constructor(
    @Inject(DEPENDENCIES.queue.telemetryBroker)
    private readonly broker: Broker,
    @Inject(DatabaseModule.READINGS_REPOSITORY)
    private readonly readingsRepository: ReadingsRepository,
    @Inject(DatabaseModule.MEASUREMENTS_REPOSITORY)
    private readonly measurementsRepository: MeasurementsRepository,
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handle() {
    const useCase = new ParseReadingsUseCase(
      this.broker,
      this.readingsRepository,
      this.measurementsRepository,
      this.parametersRepository,
    )
    try {
      console.log('Parsing readings')
      await useCase.execute()
    } catch (error) {
      console.error(error)
    }
  }
}
