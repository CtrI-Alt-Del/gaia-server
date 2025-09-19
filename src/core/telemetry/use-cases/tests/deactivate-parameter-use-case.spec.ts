import { mock, MockProxy } from 'vitest-mock-extended'

import { ParametersRepository } from '@/core/global/interfaces'
import { DeactivateParameterUseCase } from '@/core/telemetry/use-cases/deactivate-parameter-use-case'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'
import { ParameterAlreadyDeactivatedError } from '@/core/telemetry/domain/errors/parameter-already-deactivated-error'
import { ParameterFaker } from '@/core/telemetry/domain/entities/fakers/parameter-faker'

describe('DeactivateParameterUseCase', () => {
  let repository: MockProxy<ParametersRepository>
  let useCase: DeactivateParameterUseCase

  beforeEach(() => {
    repository = mock<ParametersRepository>()
    useCase = new DeactivateParameterUseCase(repository)
  })

  it('should throw an error if the parameter is not found', async () => {
    const parameter = ParameterFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: parameter.id.value })).rejects.toThrow(
      ParameterNotFoundError,
    )
  })

  it('should throw an error if the parameter is already deactivated', async () => {
    const parameter = ParameterFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(parameter)

    await expect(useCase.execute({ id: parameter.id.value })).rejects.toThrow(
      ParameterAlreadyDeactivatedError,
    )
  })

  it('should deactivate the parameter and replace it in the repository', async () => {
    const parameter = ParameterFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(parameter)

    await useCase.execute({ id: parameter.id.value })

    expect(repository.replace).toHaveBeenCalledWith(parameter)
    expect(parameter.isActive.isFalse).toBe(true)
  })
})
