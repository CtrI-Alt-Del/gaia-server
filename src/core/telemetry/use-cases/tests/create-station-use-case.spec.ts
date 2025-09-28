import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { Id } from '@/core/global/domain/structures'
import type { StationsRepository, ParametersRepository } from '@/core/global/interfaces'
import { Station } from '@/core/telemetry/domain/entities/station'
import { ParameterNotFoundError } from '@/core/telemetry/domain/errors/parameter-not-found-error'
import { CreateStationUseCase } from '@/core/telemetry/use-cases/create-station-use-case'
import { ParameterFaker } from '@/core/telemetry/domain/entities/fakers/parameter-faker'
vi.mock('@/core/telemetry/domain/entities/station')

describe('CreateStationUseCase', () => {
  let stationsRepository: MockProxy<StationsRepository>
  let parametersRepository: MockProxy<ParametersRepository>
  let useCase: CreateStationUseCase

  beforeEach(() => {
    stationsRepository = mock<StationsRepository>()
    parametersRepository = mock<ParametersRepository>()
    useCase = new CreateStationUseCase(stationsRepository, parametersRepository)
  })

  it('should create a station and add it to the repository', async () => {
    const mockParameters = [ParameterFaker.fake(), ParameterFaker.fake()]
    const mockParameterIds = mockParameters.map((p) => p.id.value)

    const mockStation = { dto: { id: 'station-id-123' } } as Station

    const createStationRequest = {
      name: 'Test Station',
      uid: 'STATION-001',
      address: '123 Test St',
      latitude: -23.1791,
      longitude: -45.8872,
    }

    parametersRepository.findManyByIds.mockResolvedValue(mockParameters)
    vi.mocked(Station.create).mockReturnValue(mockStation)
    stationsRepository.add.mockResolvedValue()

    const result = await useCase.execute({
      stationDto: createStationRequest,
      parameterIds: mockParameterIds,
    })

    expect(parametersRepository.findManyByIds).toHaveBeenCalledWith(
      mockParameterIds.map(Id.create),
    )
    expect(Station.create).toHaveBeenCalledWith({
      name: createStationRequest.name,
      uid: createStationRequest.uid,
      address: createStationRequest.address,
      latitude: createStationRequest.latitude,
      longitude: createStationRequest.longitude,
      parameters: mockParameters.map((p) => p.dto),
    })
    expect(stationsRepository.add).toHaveBeenCalledWith(mockStation)
    expect(result).toEqual(mockStation.dto)
  })

  it('should throw an error if any parameter is not found', async () => {
    const mockParameters = [ParameterFaker.fake()]
    const requestedIds = [mockParameters[0].id.value, 'non-existent-id']

    const createStationRequest = {
      name: 'Test Station',
      uid: 'STATION-001',
      address: '123 Test St',
      latitude: -23.1791,
      longitude: -45.8872,
    }

    parametersRepository.findManyByIds.mockResolvedValue(mockParameters)

    await expect(
      useCase.execute({
        stationDto: createStationRequest,
        parameterIds: requestedIds,
      }),
    ).rejects.toThrow(ParameterNotFoundError)
  })
})
