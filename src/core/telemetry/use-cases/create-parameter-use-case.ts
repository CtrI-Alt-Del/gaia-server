import type { UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/domain/dtos/parameter-dto'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'

export class CreateParameterUseCase implements UseCase<ParameterDto, ParameterDto> {
  constructor(private readonly repository: ParametersRepository) {}

  async execute(data: ParameterDto): Promise<ParameterDto> {
    const parameter = Parameter.create(data)
    await this.repository.add(parameter)
    return parameter.dto
  }
}
