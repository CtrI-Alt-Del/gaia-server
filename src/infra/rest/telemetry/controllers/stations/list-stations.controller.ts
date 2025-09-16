import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { StationsRepository } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { cursorListingSchema } from '@/infra/validation/schemas/zod/membership/users-listing-schema'
import { ListStationsUseCase } from '@/core/telemetry/use-cases'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'

class ListStationsControllerRequestQuery extends createZodDto(cursorListingSchema) {}

@StationsController()
export class ListStationsController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly repository: StationsRepository,
  ) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListStationsControllerRequestQuery) {
    const useCase = new ListStationsUseCase(this.repository)
    return await useCase.execute(query)
  }
}
