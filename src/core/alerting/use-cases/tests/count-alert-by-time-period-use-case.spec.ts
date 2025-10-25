import { describe, it, expect, beforeEach } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'
import { AlertsRepository } from '@/core/alerting/interfaces/alerts-repository'
import { AlarmLevel } from '../../domain/structures'
import { CountAlertsByTimePeriod } from '../count-alerts-by-time-period'

describe('Count Alerts By Time Period Use Case', () => {
  let alertsRepository: MockProxy<AlertsRepository>
  let useCase: CountAlertsByTimePeriod

  beforeEach(() => {
    alertsRepository = mock<AlertsRepository>()
    useCase = new CountAlertsByTimePeriod(alertsRepository)
  })

  it('should return correct count for weeks', async () => {
    alertsRepository.countByTimePeriod.mockResolvedValueOnce([{count: 3, time: "2025-10-05"}, {count: 5, time: "2025-10-12"}])

    const result = await useCase.execute({timePeriod: "WEEKLY"})
    expect(result).toEqual([{count: 3, time: "2025-10-05"}, {count: 5, time: "2025-10-12"}])
  })

  it('shoul return correct count for year', async() => {
    alertsRepository.countByTimePeriod.mockResolvedValueOnce([{count: 4, time: "2023"}, {count: 3, time: "2024"}, {count: 8, time: "2025"}])

    const result = await useCase.execute({timePeriod: "YEARLY"})
    
    expect(result).toEqual([{count: 4, time: "2023"}, {count: 3, time: "2024"}, {count: 8, time: "2025"}])
  })
})
