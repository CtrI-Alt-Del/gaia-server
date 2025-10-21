import { Body, Inject, Post, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import z from 'zod'

import { ParametersRepository, StationsRepository } from '@/core/telemetry/interfaces'
import { CreateStationUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import { stringSchema } from '@/infra/validation/schemas/zod/global'
import { latitudeSchema } from '@/infra/validation/schemas/zod/telemetry/latitude-schema'
import { longitudeSchema } from '@/infra/validation/schemas/zod/telemetry/longitude-schema'

export const schema = z.object({
  station: z.object({
    name: stringSchema,
    uid: stringSchema,
    latitude: latitudeSchema,
    address: stringSchema,
    longitude: longitudeSchema,
  }),
  parameterIds: z.array(stringSchema).min(1),
})

class CreateStationRequestBody extends createZodDto(schema) {}

@StationsController()
export class CreateStationController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
  ) {}

  @Post()
  @UsePipes(ZodValidationPipe)
  async handle(@Body() body: CreateStationRequestBody) {
    const useCase = new CreateStationUseCase(
      this.stationsRepository,
      this.parametersRepository,
    )
    return await useCase.execute({
      stationDto: body.station,
      parameterIds: body.parameterIds,
    })
  }
}
