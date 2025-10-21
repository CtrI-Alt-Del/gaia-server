import { describe, it, expect, beforeEach } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'
import { CountStationsUseCase } from '../count-stations-use-case'
import { StationsRepository } from '@/core/global/interfaces'

describe('CountStationsUseCase', () => {
  let stationsRepository: MockProxy<StationsRepository>
  let useCase: CountStationsUseCase

  beforeEach(() => {
    stationsRepository = mock<StationsRepository>()
    useCase = new CountStationsUseCase(stationsRepository)
  })

  it('should return correct total and active percentage', async () => {
    stationsRepository.countAll.mockResolvedValueOnce(10)
    stationsRepository.countActive.mockResolvedValueOnce(8)

    const result = await useCase.execute()
    expect(result).toEqual({ totalStations: 10, activeStationsPercentage: 80 })
    expect(stationsRepository.countAll).toHaveBeenCalled()
    expect(stationsRepository.countActive).toHaveBeenCalled()
  })

  it('should return 0 percentage if there are no stations', async () => {
    stationsRepository.countAll.mockResolvedValueOnce(0)
    stationsRepository.countActive.mockResolvedValueOnce(0)

    const result = await useCase.execute()
    expect(result).toEqual({ totalStations: 0, activeStationsPercentage: 0 })
  })
})
