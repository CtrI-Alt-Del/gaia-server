import { Delete, Inject, Param } from '@nestjs/common'

import { StationsRepository } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import { DeactivateStationUseCase } from '@/core/telemetry/use-cases'

@StationsController(':stationId')
export class DeactivateStationController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly repository: StationsRepository,
  ) {}

  @Delete()
  async handle(@Param('stationId') stationId: string) {
    const useCase = new DeactivateStationUseCase(this.repository)
    return await useCase.execute({ id: stationId })
  }
}
