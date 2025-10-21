import { describe, it, expect, beforeEach } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'
import { CountAlertsByLevelUseCase } from '../count-alerts-by-level-use-case'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'

describe('CountAlertsByLevelUseCase', () => {
  let alertsRepository: MockProxy<AlertsRepository>
  let useCase: CountAlertsByLevelUseCase

  beforeEach(() => {
    alertsRepository = mock<AlertsRepository>()
    useCase = new CountAlertsByLevelUseCase(alertsRepository)
  })

  it('should return correct count for WARNING and CRITICAL', async () => {
    alertsRepository.countByLevel
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)

    const result = await useCase.execute()
    expect(result).toEqual({ warningAlerts: 5, criticalAlerts: 2 })
    expect(alertsRepository.countByLevel).toHaveBeenCalledWith('WARNING')
    expect(alertsRepository.countByLevel).toHaveBeenCalledWith('CRITICAL')
  })
})
