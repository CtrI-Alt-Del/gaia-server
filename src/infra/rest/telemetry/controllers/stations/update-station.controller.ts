import { Body, Inject, Param, Put } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type {
  ParametersRepository,
  StationsRepository,
} from '@/core/telemetry/interfaces'
import { UpdateStationUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import z from 'zod'
import { stringSchema } from '@/infra/validation/schemas/zod/global'
import { latitudeSchema } from '@/infra/validation/schemas/zod/telemetry/latitude-schema'
import { longitudeSchema } from '@/infra/validation/schemas/zod/telemetry/longitude-schema'

export const schema = z.object({
  station: z.object({
    name: stringSchema,
    uid: stringSchema,
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    address: stringSchema,
  }),
  parameterIds: z.array(stringSchema).min(1),
})

class UpdateStationRequestBody extends createZodDto(schema) {}

const bodyValidationPipe = new ZodValidationPipe(schema)

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
    return await useCase.execute({
      stationId,
      stationDto: body.station,
      parameterIds: body.parameterIds,
    })
  }
}
