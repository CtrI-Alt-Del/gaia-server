import { Get, Inject } from '@nestjs/common'

import { StationsRepository } from '@/core/global/interfaces'
import { CountStationsUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'

@StationsController()
export class CountStationsController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly repository: StationsRepository,
  ) {}

  @Get('count')
  async handle() {
    console.log('[CountStationsController] Chamado /count')
    const useCase = new CountStationsUseCase(this.repository)
    return await useCase.execute()
  }
}
