import { ParametersRepository, StationsRepository } from '@/core/telemetry/interfaces'
import { GetStationParametersUseCase } from '@/core/telemetry/use-cases'
import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import { Get, Inject, Param } from '@nestjs/common'

@StationsController()
export class GetStationParametersController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
  ) {}
  @Get('/parameters/:stationId')
  async execute(@Param('stationId') stationId: string) {
    const useCase = new GetStationParametersUseCase(
      this.stationsRepository,
      this.parametersRepository,
    )
    return await useCase.execute({ stationId })
  }
}
