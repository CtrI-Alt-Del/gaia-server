import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { ParametersRepository } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { ParametersController } from '@/infra/rest/telemetry/controllers/parameters/parameters.controller'
import { ListParametersUseCase } from '@/core/telemetry/use-cases'
import { statusSchema, stringSchema } from '@/infra/validation/schemas/zod/global'
import { plusIntegerSchema } from '@/infra/validation/schemas/zod/global'
import { z } from 'zod'

export const schema = z.object({
  name: stringSchema.optional(),
  status: statusSchema.optional().default('all'),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
})

class ListParametersControllerRequestQuery extends createZodDto(schema) {}

@ParametersController()
export class ListParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Get()
  @UsePipes(ZodValidationPipe)
  async handle(@Query() query: ListParametersControllerRequestQuery) {
    const useCase = new ListParametersUseCase(this.repository)
    return await useCase.execute(query)
  }
}
