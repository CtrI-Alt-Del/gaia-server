import { Id } from '@/core/global/domain/structures'
import type { UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'
import { ParameterDto } from '@/core/telemetry/dtos/parameter-dto'
import { Parameter } from '@/core/telemetry/entities/parameter'

type UseCaseInput = { data: Partial<ParameterDto>; id: string }

export class EditParameterUseCase implements UseCase<UseCaseInput, ParameterDto> {
  constructor(private readonly repository: ParametersRepository) {}

  async execute({ id, data }: UseCaseInput): Promise<ParameterDto> {
    const existingParameter = await this.findById(Id.create(id))
    const updatedParameter = existingParameter.update(data)
    await this.repository.replace(updatedParameter)
    return updatedParameter.dto
  }
  async findById(id: Id): Promise<Parameter> {
    const parameter = await this.repository.findById(id)
    if (!parameter) {
      throw new Error('Parameter not found')
    }
    return parameter
  }
}
