import { Body, Inject, Param, Put } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type { StationsRepository } from '@/core/global/interfaces'
import { EditStationUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import {  updateStationSchema } from '@/infra/validation/schemas/zod/telemetry'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'

class EditStationRequestBody extends createZodDto(updateStationSchema) {}

const bodyValidationPipe = new ZodValidationPipe(updateStationSchema)

@StationsController()
export class EditStationController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly repository: StationsRepository,
  ) {}

  @Put('/:stationId')
  async handle(
    @Body(bodyValidationPipe) body: EditStationRequestBody,
    @Param('stationId') stationId: string,
  ) {
    const useCase = new EditStationUseCase(this.repository)
    return await useCase.execute({ data: body, stationId })
  }
}
