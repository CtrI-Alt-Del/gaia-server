import { Inject, Injectable } from '@nestjs/common'

import { Broker, StationsRepository } from '@/core/global/interfaces'

import { DEPENDENCIES } from '@/infra/constants'
import { Cron, CronExpression } from '@nestjs/schedule'
import { TransferRawMeasurementsUseCase } from '@/core/telemetry/use-cases/transfer-raw-measurements-use-case'
import { MongoMeasurementsRepository } from '@/core/telemetry/interfaces'
import { MeasurementRepository } from '@/core/telemetry/interfaces/measurement-repository'
import { DatabaseModule } from '@/infra/database/database.module'

@Injectable()
export class ParseMeasurementsJob {
  constructor(
    @Inject(DEPENDENCIES.queue.telemetryBroker)
    private readonly broker: Broker,
    @Inject(DatabaseModule.MONGO_MEASUREMENTS_REPOSITORY)
    private readonly mongoMeasurmentsRepository: MongoMeasurementsRepository,
    @Inject(DatabaseModule.MEASUREMENTS_REPOSITORY)
    private readonly measurementsRepository: MeasurementRepository,
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  async handle() {
    const useCase = new TransferRawMeasurementsUseCase(
      this.broker,
      this.mongoMeasurmentsRepository,
      this.measurementsRepository,
      this.stationsRepository,
    )
    try {
      await useCase.execute()
    } catch (error) {
      console.error('Error executing TransferRawMeasurmentsUseCase:', error)
    }
  }
}
