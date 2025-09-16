import { Body, Inject, Param, Put } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type { ParametersRepository, StationsRepository } from '@/core/global/interfaces'
import { EditStationUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { updateStationSchema } from '@/infra/validation/schemas/zod/telemetry'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'

class EditStationRequestBody extends createZodDto(updateStationSchema) {}

const bodyValidationPipe = new ZodValidationPipe(updateStationSchema)

@StationsController()
export class EditStationController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
  ) {}

  @Put('/:stationId')
  async handle(
    @Body(bodyValidationPipe) body: EditStationRequestBody,
    @Param('stationId') stationId: string,
  ) {
    const useCase = new EditStationUseCase(
      this.parametersRepository,
      this.stationsRepository,
    )
    return await useCase.execute({ data: body, stationId })
  }
}
