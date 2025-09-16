import { mock, MockProxy } from 'vitest-mock-extended'

import { ParametersRepository } from '@/core/global/interfaces'
import { ActivateParameterUseCase } from '@/core/telemetry/use-cases/activate-parameter-use-case'
import { ParameterFaker } from '@/core/telemetry/domain/entities/fakers/parameter-faker'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'
import { ParameterAlreadyActivatedError } from '@/core/telemetry/domain/errors/parameter-already-activated-error'

describe('ActivateParameterUseCase', () => {
  let repository: MockProxy<ParametersRepository>
  let useCase: ActivateParameterUseCase

  beforeEach(() => {
    repository = mock<ParametersRepository>()
    useCase = new ActivateParameterUseCase(repository)
  })

  it('should throw an error if the parameter is not found', async () => {
    const parameter = ParameterFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: parameter.id.value })).rejects.toThrow(
      ParameterNotFoundError,
    )
  })

  it('should throw an error if the parameter is already activated', async () => {
    const parameter = ParameterFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(parameter)

    await expect(useCase.execute({ id: parameter.id.value })).rejects.toThrow(
      ParameterAlreadyActivatedError,
    )
  })

  it('should activate the parameter and replace it in the repository', async () => {
    const parameter = ParameterFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(parameter)

    await useCase.execute({ id: parameter.id.value })

    expect(repository.replace).toHaveBeenCalledWith(parameter)
    expect(parameter.isActive.isTrue).toBe(true)
  })
})
