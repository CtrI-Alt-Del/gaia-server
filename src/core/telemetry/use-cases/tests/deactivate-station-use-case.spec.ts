import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { Id } from '@/core/global/domain/structures'
import type { StationsRepository } from '@/core/global/interfaces'
import { DeactivateStationUseCase } from '@/core/telemetry/use-cases/deactivate-station-use-case'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'
import { StationAlreadyDeactivatedError } from '@/core/telemetry/domain/errors/station-already-deactivated-error'

describe('DeactivateStationUseCase', () => {
  let repository: MockProxy<StationsRepository>
  let useCase: DeactivateStationUseCase

  beforeEach(() => {
    repository = mock<StationsRepository>()
    useCase = new DeactivateStationUseCase(repository)
  })

  it('should throw an error if the station is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: 'non-existent-id' })).rejects.toThrow(
      StationNotFoundError,
    )
  })

  it('should throw an error if the station is already deactivated', async () => {
    const inactiveStation = StationsFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(inactiveStation)

    await expect(
      useCase.execute({ id: inactiveStation.id.value }),
    ).rejects.toThrow(StationAlreadyDeactivatedError)
  })

  it('should deactivate a station and save it to the repository', async () => {
    const activeStation = StationsFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(activeStation)
    repository.replace.mockResolvedValue()

    const deactivateSpy = vi.spyOn(activeStation, 'deactivate')

    await useCase.execute({ id: activeStation.id.value })

    expect(repository.findById).toHaveBeenCalledWith(
      Id.create(activeStation.id.value),
    )
    expect(deactivateSpy).toHaveBeenCalledOnce()
    expect(repository.replace).toHaveBeenCalledWith(activeStation, [])
  })
})
