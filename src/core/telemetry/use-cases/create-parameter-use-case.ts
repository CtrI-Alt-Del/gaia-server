import type { UseCase } from '@/core/global/interfaces'
import type { ParametersRepository } from '@/core/global/interfaces'

export class CreateParameterUseCase implements UseCase<void, void> {
  constructor(private readonly repository: ParametersRepository) {}

  async execute(): Promise<void> {}
}
