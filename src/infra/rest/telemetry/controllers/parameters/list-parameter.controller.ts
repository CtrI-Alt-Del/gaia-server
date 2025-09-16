import { Get, Inject, Query, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { ParametersRepository } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { ParametersController } from '@/infra/rest/telemetry/controllers/parameters/parameters.controller'
import { cursorListingSchema } from '@/infra/validation/schemas/zod/membership/users-listing-schema'
import { ListParametersUseCase } from '@/core/telemetry/use-cases'

class ListParametersControllerRequestQuery extends createZodDto(cursorListingSchema) {}

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
