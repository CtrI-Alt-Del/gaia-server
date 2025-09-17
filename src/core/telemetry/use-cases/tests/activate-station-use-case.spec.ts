import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { Id } from '@/core/global/domain/structures'
import type { StationsRepository } from '@/core/global/interfaces'
import { ActivateStationUseCase } from '@/core/telemetry/use-cases/activate-station-use-case'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'
import { StationAlreadyActivatedError } from '@/core/telemetry/domain/errors/station-already-activated-error'

describe('ActivateStationUseCase', () => {
  let repository: MockProxy<StationsRepository>
  let useCase: ActivateStationUseCase

  beforeEach(() => {
    repository = mock<StationsRepository>()
    useCase = new ActivateStationUseCase(repository)
  })

  it('should throw an error if the station is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(
      StationNotFoundError,
    )
  })

  it('should throw an error if the station is already activated', async () => {
    const activeStation = StationsFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(activeStation)

    await expect(useCase.execute({ id: activeStation.id.value })).rejects.toThrow(
      StationAlreadyActivatedError,
    )
  })

  it('should activate a station and save it to the repository', async () => {
    const inactiveStation = StationsFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(inactiveStation)
    repository.replace.mockResolvedValue()

    const activateSpy = vi.spyOn(inactiveStation, 'activate')

    await useCase.execute({ id: inactiveStation.id.value })

    expect(repository.findById).toHaveBeenCalledWith(Id.create(inactiveStation.id.value))
    expect(activateSpy).toHaveBeenCalledOnce()
    expect(repository.replace).toHaveBeenCalledWith(inactiveStation)
  })
})
