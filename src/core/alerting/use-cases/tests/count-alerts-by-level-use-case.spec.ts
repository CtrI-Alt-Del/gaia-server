import { describe, it, expect, beforeEach } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'
import { CountAlertsByLevelUseCase } from '../count-alerts-by-level-use-case'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { AlarmLevel } from '../../domain/structures'

describe('Count Alerts By Level Use Case', () => {
  let alertsRepository: MockProxy<AlertsRepository>
  let useCase: CountAlertsByLevelUseCase

  beforeEach(() => {
    alertsRepository = mock<AlertsRepository>()
    useCase = new CountAlertsByLevelUseCase(alertsRepository)
  })

  it('should return correct count for WARNING and CRITICAL', async () => {
    alertsRepository.countByAlarmLevel.mockResolvedValueOnce(5).mockResolvedValueOnce(2)

    const result = await useCase.execute()
    expect(result).toEqual({ warningAlerts: 5, criticalAlerts: 2 })
    expect(alertsRepository.countByAlarmLevel).toHaveBeenCalledWith(
      AlarmLevel.createAsWarning(),
    )
    expect(alertsRepository.countByAlarmLevel).toHaveBeenCalledWith(
      AlarmLevel.createAsCritical(),
    )
  })
})
