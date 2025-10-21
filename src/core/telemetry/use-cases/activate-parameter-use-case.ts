import { Id } from '@/core/global/domain/structures'
import { ParametersRepository } from '../interfaces/parameters-repository'
import { UseCase } from '@/core/global/interfaces'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { ParameterAlreadyActivatedError } from '@/core/telemetry/domain/errors/parameter-already-activated-error'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'

type Request = {
  id: string
}

export class ActivateParameterUseCase implements UseCase<Request, void> {
  constructor(private readonly repository: ParametersRepository) {}

  async execute(parameterDto: Request): Promise<void> {
    const parameter = await this.findById(Id.create(parameterDto.id))

    if (parameter.isActive.isTrue) {
      throw new ParameterAlreadyActivatedError()
    }

    parameter.activate()

    await this.repository.replace(parameter)
  }

  async findById(id: Id): Promise<Parameter> {
    const parameter = await this.repository.findById(id)
    if (!parameter) throw new ParameterNotFoundError()
    return parameter
  }
}
