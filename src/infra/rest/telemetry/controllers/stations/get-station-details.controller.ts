import { StationsRepository } from '@/core/global/interfaces'
import { GetStationDetailsUseCase } from '@/core/telemetry/use-cases'
import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import { Get, Inject, Param } from '@nestjs/common'

@StationsController()
export class GetStationDetailsController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly repository: StationsRepository,
  ) {}
  @Get('/:stationId')
  async execute(@Param('stationId') stationId: string) {
    const useCase = new GetStationDetailsUseCase(this.repository)
    return await useCase.execute({stationId})
  }
}
