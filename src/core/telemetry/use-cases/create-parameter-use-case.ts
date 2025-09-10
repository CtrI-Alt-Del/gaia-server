import type { UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/dtos/parameter.dto'
import { Parameter } from '@/core/telemetry/entities/parameter'

export class CreateParameterUseCase implements UseCase<ParameterDto, void> {
  constructor(private readonly repository: ParametersRepository) {
    this.repository = repository
  }

  async execute(data: ParameterDto): Promise<void> {
    const parameter = Parameter.create(data)
    await this.repository.add(parameter)
  }
}
