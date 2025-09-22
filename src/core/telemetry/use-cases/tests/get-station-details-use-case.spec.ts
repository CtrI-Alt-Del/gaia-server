import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach } from 'vitest'

import { Id } from '@/core/global/domain/structures'
import type { StationsRepository } from '@/core/global/interfaces'
import { GetStationDetailsUseCase } from '@/core/telemetry/use-cases/get-station-details-use-case'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'

describe('GetStationDetailsUseCase', () => {
  let repository: MockProxy<StationsRepository>
  let useCase: GetStationDetailsUseCase

  beforeEach(() => {
    repository = mock<StationsRepository>()
    useCase = new GetStationDetailsUseCase(repository)
  })

  it('should throw an error if the station is not found', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ stationId: 'non-existent-id' }),
    ).rejects.toThrow(StationNotFoundError)
  })

  it('should return the station details DTO if the station is found', async () => {
    const fakeStation = StationsFaker.fake()
    repository.findById.mockResolvedValue(fakeStation)

    const result = await useCase.execute({ stationId: fakeStation.id.value })

    expect(repository.findById).toHaveBeenCalledWith(Id.create(fakeStation.id.value))
    expect(result).toEqual(fakeStation.dto)
  })
})
