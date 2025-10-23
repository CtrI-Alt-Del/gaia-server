import { Inject, Param, Patch } from '@nestjs/common'

import { StationsRepository } from '@/core/telemetry/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { ActivateStationUseCase } from '@/core/telemetry/use-cases'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'

@StationsController(':stationId')
export class ActivateStationController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly repository: StationsRepository,
  ) {}

  @Patch()
  async handle(@Param('stationId') stationId: string) {
    const useCase = new ActivateStationUseCase(this.repository)
    return await useCase.execute({ id: stationId })
  }
}
