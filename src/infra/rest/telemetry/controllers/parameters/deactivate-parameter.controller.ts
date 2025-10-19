import { Delete, Inject, Param } from '@nestjs/common'

import { ParametersRepository } from '@/core/telemetry/interfaces'

import { DatabaseModule } from '@/infra/database/database.module'
import { ParametersController } from '@/infra/rest/telemetry/controllers/parameters/parameters.controller'
import { DeactivateParameterUseCase } from '@/core/telemetry/use-cases/deactivate-parameter-use-case'

@ParametersController(':parameterId')
export class DeactivateParameterController {
  constructor(
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly repository: ParametersRepository,
  ) {}

  @Delete()
  async handle(@Param('parameterId') parameterId: string) {
    const useCase = new DeactivateParameterUseCase(this.repository)
    return await useCase.execute({ id: parameterId })
  }
}
