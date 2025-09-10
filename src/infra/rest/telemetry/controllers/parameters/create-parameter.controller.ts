import { Body, Inject, Post } from '@nestjs/common'

import { CreateParameterUseCase } from '@/core/telemetry/use-cases'

import { ParametersController } from './parameters.controller'
import type { ParametersRepository } from '@/core/global/interfaces'
import { DatabaseModule } from '@/infra/database/database.module'
import z from 'zod'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'
import { ApiTags } from '@nestjs/swagger'

const createParameterRequestBodySchema = z.object({
  name: z.string().min(1),
  unitOfMeasure: z.string().min(1),
  numberOfDecimalPlaces: z.number().min(0).max(10),
  factor: z.number().min(0),
  offset: z.number(),
})

class RequestBody extends createZodDto(createParameterRequestBodySchema) {}

const bodyValidationPipe = new ZodValidationPipe(createParameterRequestBodySchema)

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
