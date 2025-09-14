import { Body, Inject, Param, Put } from '@nestjs/common'
import { createZodDto, ZodValidationPipe } from 'nestjs-zod'

import type { ParametersRepository } from '@/core/global/interfaces'
import { EditParameterUseCase } from '@/core/telemetry/use-cases'

import { DatabaseModule } from '@/infra/database/database.module'
import { updateParameterSchema } from '@/infra/validation/schemas/zod/telemetry'
import { ParametersController } from './parameters.controller'

class RequestBody extends createZodDto(updateParameterSchema) {}

const bodyValidationPipe = new ZodValidationPipe(updateParameterSchema)

@ParametersController()
export class EditParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Put('/:id')
  async handle(@Body() body: RequestBody, @Param('id') id: string) {
    const useCase = new EditParameterUseCase(this.repository)
    return await useCase.execute({ data: body, id })
  }
}
