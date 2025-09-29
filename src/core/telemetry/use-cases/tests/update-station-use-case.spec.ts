import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { Id } from '@/core/global/domain/structures'
import type { ParametersRepository, StationsRepository } from '@/core/global/interfaces'
import { StationNotFoundError } from '@/core/telemetry/domain/errors/station-not-found-error'
import { UpdateStationUseCase } from '@/core/telemetry/use-cases/update-station-use-case'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'

describe('UpdateStationUseCase', () => {
  let stationsRepository: MockProxy<StationsRepository>
  let parametersRepository: MockProxy<ParametersRepository>
  let useCase: UpdateStationUseCase

  beforeEach(() => {
    stationsRepository = mock<StationsRepository>()
    parametersRepository = mock<ParametersRepository>()
    useCase = new UpdateStationUseCase(parametersRepository, stationsRepository)
  })

  it('should update a station and save it to the repository', async () => {
    const existingStation = StationsFaker.fake()
    const updatedStation = StationsFaker.fake()
    const updateData = {
      name: 'New Station Name',
      uid: 'NEW-uid-001',
      latitude: -10.0,
      longitude: -20.0,
      address: '456 New Address St',
    }

    stationsRepository.findById.mockResolvedValue(existingStation)
    stationsRepository.replace.mockResolvedValue()

    vi.spyOn(existingStation, 'update').mockReturnValue(updatedStation)

    const result = await useCase.execute({
      stationId: existingStation.id.value,
      stationDto: updateData,
      parameterIds: [],
    })

    expect(stationsRepository.findById).toHaveBeenCalledWith(
      Id.create(existingStation.id.value),
    )
    expect(existingStation.update).toHaveBeenCalledWith(updateData)
    expect(stationsRepository.replace).toHaveBeenCalledWith(updatedStation, [])
    expect(result).toEqual(updatedStation.dto)
  })

  it('should throw an error if the station is not found', async () => {
    const stationId = 'non-existent-id'
    const updateData = { name: 'Some new name' }

    stationsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ stationId, stationDto: updateData, parameterIds: [] }),
    ).rejects.toThrow(StationNotFoundError)
  })
})
