import { mock, MockProxy } from 'vitest-mock-extended'
import { AlarmsRepository } from '../../interfaces'
import { ActivateAlarmUseCase } from '../activate-alarms-use-case'
import { AlarmsFaker } from '../../domain/entities/fakers/alarms-faker'
import { AlarmNotFoundError } from '@/core/telemetry/domain/errors/alarm-not-found-error'
import { AlarmAlreadyActivatedError } from '@/core/telemetry/domain/errors/alarm-already-activated-error'

describe('ActivateAlarmUseCase', () => {
  let repository: MockProxy<AlarmsRepository>
  let useCase: ActivateAlarmUseCase

  beforeEach(() => {
    repository = mock<AlarmsRepository>()
    useCase = new ActivateAlarmUseCase(repository)
  })

  it('should throw an error if the alarm is not found', async () => {
    const alarm = AlarmsFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: alarm.id.value })).rejects.toThrow(
      AlarmNotFoundError,
    )
  })

  it('should throw an error if the alarm is already activated', async () => {
    const alarm = AlarmsFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(alarm)

    await expect(useCase.execute({ id: alarm.id.value })).rejects.toThrow(
      AlarmAlreadyActivatedError,
    )
  })

  it('should activate the alarm and replace it in the repository', async () => {
    const alarm = AlarmsFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(alarm)

    await useCase.execute({ id: alarm.id.value })

    expect(repository.replace).toHaveBeenCalledWith(alarm)
    expect(alarm.isActive.isTrue).toBe(true)
  })
})
