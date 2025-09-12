import { Body, Inject, Post, UsePipes } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type { ParametersRepository } from '@/core/global/interfaces'
import { CreateParameterUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { parameterSchema } from '@/infra/validation/schemas/zod/telemetry'
import { ParametersController } from './parameters.controller'

class RequestBody extends createZodDto(parameterSchema) {}

@ParametersController()
export class CreateParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(parameterSchema))
  async handle(@Body() body: RequestBody) {
    const useCase = new CreateParameterUseCase(this.repository)
    return await useCase.execute(body)
  }
}
