import { Id } from '@/core/global/domain/structures'
import { ParametersRepository } from '../interfaces/parameters-repository'
import { UseCase } from '@/core/global/interfaces'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { ParameterAlreadyDeactivatedError } from '@/core/telemetry/domain/errors/parameter-already-deactivated-error'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'

type Request = {
  id: string
}

export class DeactivateParameterUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: ParametersRepository) {}

  async execute(parameterId: Request): Promise<void> {
    const user = await this.findById(Id.create(parameterId.id))

    if (user.isActive.isFalse) {
      throw new ParameterAlreadyDeactivatedError()
    }

    user.deactivate()

    await this.repository.replace(user)
  }

  async findById(id: Id): Promise<Parameter> {
    const user = await this.repository.findById(id)
    if (!user) throw new ParameterNotFoundError()
    return user
  }
}
