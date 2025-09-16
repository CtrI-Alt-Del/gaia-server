import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { Id } from '@/core/global/domain/structures'
import type { StationsRepository } from '@/core/global/interfaces'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'
import { EditStationUseCase } from '@/core/telemetry/use-cases/edit-station-use-case'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'

describe('EditStationUseCase', () => {
  let repository: MockProxy<StationsRepository>
  let useCase: EditStationUseCase

  beforeEach(() => {
    repository = mock<StationsRepository>()
    useCase = new EditStationUseCase(repository)
  })

  it('should update a station and save it to the repository', async () => {
    const existingStation = StationsFaker.fake()
    const updatedStation = StationsFaker.fake() 
    
    const updateData = {
      name: 'New Station Name',
      UID: 'NEW-UID-001',
      latitude: -10.0,
      longitude: -20.0,
      address: '456 New Address St',
    }

    repository.findById.mockResolvedValue(existingStation)
    repository.replace.mockResolvedValue()

    vi.spyOn(existingStation, 'update').mockReturnValue(updatedStation)

    const result = await useCase.execute({
      stationId: existingStation.id.value,
      data: updateData,
    })

    expect(repository.findById).toHaveBeenCalledWith(
      Id.create(existingStation.id.value),
    )
    expect(existingStation.update).toHaveBeenCalledWith(updateData)
    expect(repository.replace).toHaveBeenCalledWith(updatedStation)
    expect(result).toEqual(updatedStation.dto)
  })

  it('should throw an error if the station is not found', async () => {
    const stationId = 'non-existent-id'
    const updateData = { name: 'Some new name' }

    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ stationId, data: updateData }),
    ).rejects.toThrow(StationNotFoundError)
  })
})
