import { Inject, Param, Patch } from '@nestjs/common'

import { ParametersRepository } from '@/core/global/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { ParametersController } from '@/infra/rest/telemetry/controllers/parameters/parameters.controller'
import { ActivateParameterUseCase } from '@/core/telemetry/use-cases'

@ParametersController(':parameterId')
export class ActivateParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Patch()
  async handle(@Param('parameterId') parameterId: string) {
    const useCase = new ActivateParameterUseCase(this.repository)
    return await useCase.execute({ id: parameterId })
  }
}
