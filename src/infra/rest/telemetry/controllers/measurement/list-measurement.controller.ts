import { Inject, Query, Sse, UsePipes } from '@nestjs/common'
import { defer, map, repeat } from 'rxjs'

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

  @Sse()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListMeasurementsControllerRequestQuery) {
    return defer(async () => {
      const useCase = new ListMeasurementsUseCase(this.repository)
      return await useCase.execute(query)
    }).pipe(
      repeat({
        delay: 1000,
      }),
      map((measurements) => ({
        type: 'message',
        data: measurements,
      })),
    )
  }
}
