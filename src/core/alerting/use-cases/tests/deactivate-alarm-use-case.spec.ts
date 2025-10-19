import { mock, MockProxy } from 'vitest-mock-extended'
import { AlarmsRepository } from '../../interfaces'
import { AlarmsFaker } from '../../domain/entities/fakers/alarms-faker'
import { AlarmNotFoundError } from '@/core/telemetry/domain/errors/alarm-not-found-error'
import { DeactivateAlarmUseCase } from '../deactivate-alarms-use-case'
import { AlarmAlreadyDeactivatedError } from '@/core/telemetry/domain/errors/alarm-already-deactivated-error'

describe('DeactivateAlarmUseCase', () => {
  let repository: MockProxy<AlarmsRepository>
  let useCase: DeactivateAlarmUseCase

  beforeEach(() => {
    repository = mock<AlarmsRepository>()
    useCase = new DeactivateAlarmUseCase(repository)
  })

  it('should throw an error if the alarm is not found', async () => {
    const alarm = AlarmsFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: alarm.id.value })).rejects.toThrow(
      AlarmNotFoundError,
    )
  })

  it('should throw an error if the alarm is already deactivated', async () => {
    const alarm = AlarmsFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(alarm)

    await expect(useCase.execute({ id: alarm.id.value })).rejects.toThrow(
      AlarmAlreadyDeactivatedError,
    )
  })

  it('should deactivate the alarm and replace it in the repository', async () => {
    const alarm = AlarmsFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(alarm)

    await useCase.execute({ id: alarm.id.value })

    expect(repository.replace).toHaveBeenCalledWith(alarm)
    expect(alarm.isActive.isFalse).toBe(true)
  })
})
