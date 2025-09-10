import { Body, Inject, Post } from '@nestjs/common'

import { CreateParameterUseCase } from '@/core/telemetry/use-cases'

import { ParametersController } from './parameters.controller'
import type { ParametersRepository } from '@/core/global/interfaces'
import { DatabaseModule } from '@/infra/database/database.module'

type RequestBody = {
  name: string
}

@ParametersController()
export class CreateParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Post()
  async handle(@Body() body: RequestBody) {
    const useCase = new CreateParameterUseCase(this.repository)
    await useCase.execute()
    return body
  }
}
