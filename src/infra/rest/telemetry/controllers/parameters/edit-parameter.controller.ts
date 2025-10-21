import { Body, Inject, Param, Put } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import { ParametersRepository } from '@/core/telemetry/interfaces'
import { UpdateParameterUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { updateParameterSchema } from '@/infra/validation/schemas/zod/telemetry'
import { ParametersController } from './parameters.controller'

class UpdateParameterRequestBody extends createZodDto(updateParameterSchema) {}

const bodyValidationPipe = new ZodValidationPipe(updateParameterSchema)

@ParametersController()
export class UpdateParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Put('/:paramterId')
  async handle(
    @Body(bodyValidationPipe) body: UpdateParameterRequestBody,
    @Param('paramterId') id: string,
  ) {
    const useCase = new UpdateParameterUseCase(this.repository)
    return await useCase.execute({ data: body, id })
  }
}
