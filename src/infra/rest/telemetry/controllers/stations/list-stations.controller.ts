import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { StationsRepository } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { ListStationsUseCase } from '@/core/telemetry/use-cases'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import {
  booleanSchema,
  plusIntegerSchema,
  stringSchema,
} from '@/infra/validation/schemas/zod/global'
import z from 'zod'

const cursorListingSchema = z.object({
  name: stringSchema.optional(),
  isActive: booleanSchema.optional().default(true),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
})
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
