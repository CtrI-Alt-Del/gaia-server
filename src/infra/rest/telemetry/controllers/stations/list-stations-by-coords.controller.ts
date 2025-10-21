import { numberSchema } from '@/infra/validation/schemas/zod/global'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import z from 'zod'
import { StationsController } from './stations.controller'
import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { StationsRepository } from '@/core/telemetry/interfaces'
import { ListStationsByCoordsUseCase } from '@/core/telemetry/use-cases/'

const coordSchema = z.object({
  lat1: numberSchema,
  long1: numberSchema,
  lat2: numberSchema,
  long2: numberSchema,
})

class ListStationsByCoordsControllerRequestQuery extends createZodDto(coordSchema) {}

@StationsController('box/coords')
export class ListStationsByCoordsController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly repository: StationsRepository,
  ) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListStationsByCoordsControllerRequestQuery) {
    const useCase = new ListStationsByCoordsUseCase(this.repository)
    return await useCase.execute(query)
  }
}
