import { Body, Inject, Param, Put } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type { ParametersRepository, StationsRepository } from '@/core/global/interfaces'
import { UpdateStationUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { updateStationSchema } from '@/infra/validation/schemas/zod/telemetry'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'

class UpdateStationRequestBody extends createZodDto(updateStationSchema) {}

const bodyValidationPipe = new ZodValidationPipe(updateStationSchema)

@StationsController()
export class UpdateStationController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
  ) {}

  @Put('/:stationId')
  async handle(
    @Body(bodyValidationPipe) body: UpdateStationRequestBody,
    @Param('stationId') stationId: string,
  ) {
    const useCase = new UpdateStationUseCase(
      this.parametersRepository,
      this.stationsRepository,
    )
    return await useCase.execute({ data: body, stationId })
  }
}
