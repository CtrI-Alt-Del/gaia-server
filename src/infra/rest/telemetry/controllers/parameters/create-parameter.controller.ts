import { Body, Inject, Post } from '@nestjs/common'

import { CreateParameterUseCase } from '@/core/telemetry/use-cases'

import { ParametersController } from './parameters.controller'
import type { ParametersRepository } from '@/core/global/interfaces'
import { DatabaseModule } from '@/infra/database/database.module'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import { ApiTags } from '@nestjs/swagger'
import { createParameterRequestSchema } from '@/validation/schemas/zod/telemetry'


class RequestBody extends createZodDto(createParameterRequestSchema) {}

const bodyValidationPipe = new ZodValidationPipe(createParameterRequestSchema)

@ApiTags('Parameters')
@ParametersController()
export class CreateParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: RequestBody) {
    const useCase = new CreateParameterUseCase(this.repository)
    await useCase.execute(body)
    return body
  }
}
