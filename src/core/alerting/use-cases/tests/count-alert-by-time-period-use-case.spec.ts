import { describe, it, expect, beforeEach } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { CountAlertsByTimePeriod } from '../count-alerts-by-time-period'

describe('Count Alerts By Time Period Use Case', () => {
  let alertsRepository: MockProxy<AlertsRepository>
  let useCase: CountAlertsByTimePeriod

  beforeEach(() => {
    alertsRepository = mock<AlertsRepository>()
    useCase = new CountAlertsByTimePeriod(alertsRepository)
  })

  it('should return correct count for the last week', async () => {
    alertsRepository.countByTimePeriod.mockResolvedValueOnce([
      { criticalCount: 3, warningCount: 2, time: '2025-10-13' },
      { criticalCount: 5, warningCount: 8, time: '2025-10-15' },
    ])

    const result = await useCase.execute({ timePeriod: 'WEEKLY' })
    expect(result).toEqual([
      { criticalCount: 3, warningCount: 2, time: '2025-10-13' },
      { criticalCount: 5, warningCount: 8, time: '2025-10-15' },
    ])
  })

  it('shoul return correct count for the last year', async () => {
    alertsRepository.countByTimePeriod.mockResolvedValueOnce([
      { criticalCount: 2, warningCount: 3, time: '2025-02-01' },
      { criticalCount: 8, warningCount: 5, time: '2025-04-01' },
      { criticalCount: 1, warningCount: 1, time: '2025-06-1' },
    ])

    const result = await useCase.execute({ timePeriod: 'MONTHLY' })

    expect(result).toEqual([
      { criticalCount: 2, warningCount: 3, time: '2025-02-01' },
      { criticalCount: 8, warningCount: 5, time: '2025-04-01' },
      { criticalCount: 1, warningCount: 1, time: '2025-06-1' },
    ])
  })
})
