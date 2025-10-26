import { Get, Inject, Query, UsePipes } from '@nestjs/common'

import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import z from 'zod'

import { MeasurementsRepository } from '@/core/telemetry/interfaces'
import { ListMeasurementsUseCase } from '@/core/telemetry/use-cases/list-measurements-use-case'

import {
  plusIntegerSchema,
  statusSchema,
  stringSchema,
} from '@/infra/validation/schemas/zod/global'
import { DatabaseModule } from '@/infra/database/database.module'
import { MeasurementsController } from './measurements.controller'

export const schema = z.object({
  status: statusSchema.optional().default('all'),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
  date: stringSchema.optional(),
  parameterId: stringSchema.optional(),
  stationId: stringSchema.optional(),
})

class ListMeasurementsControllerRequestQuery extends createZodDto(schema) {}

@MeasurementsController()
export class ListMeasurementController {
  constructor(
    @Inject(DatabaseModule.MEASUREMENTS_REPOSITORY)
    private readonly repository: MeasurementsRepository,
  ) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListMeasurementsControllerRequestQuery) {
    const useCase = new ListMeasurementsUseCase(this.repository)
    return await useCase.execute(query)
  }
}
