import { Body, Inject, Post, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type { ParametersRepository, StationsRepository } from '@/core/global/interfaces'
import { CreateStationUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import { createStationSchema } from '@/infra/validation/schemas/zod/telemetry/create-station-schema'

class CreateStationRequestBody extends createZodDto(createStationSchema) {}

@StationsController()
export class CreateStationController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createStationSchema))
  async handle(@Body() body: CreateStationRequestBody) {
    const useCase = new CreateStationUseCase(
      this.stationsRepository,
      this.parametersRepository,
    )
    return await useCase.execute(body)
  }
}
