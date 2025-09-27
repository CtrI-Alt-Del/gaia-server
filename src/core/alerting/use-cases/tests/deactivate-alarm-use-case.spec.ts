import { mock, MockProxy } from "vitest-mock-extended"
import { AlarmsRepository } from "../../interfaces"
import { AlarmFaker } from "../../domain/entities/fakers/alarm-faker"
import { AlarmNotFoundError } from "@/core/alerting/domain/errors/alarm-not-found-error"
import { DeactivateAlarmUseCase } from "../deactivate-alarm-use-case"
import { AlarmAlreadyDeactivatedError } from "@/core/alerting/domain/errors/alarm-already-deactivated-error"

describe('DeactivateAlarmUseCase', () => {
  let repository: MockProxy<AlarmsRepository>
  let useCase: DeactivateAlarmUseCase

  beforeEach(() => {
    repository = mock<AlarmsRepository>()
    useCase = new DeactivateAlarmUseCase(repository)
  })

  it('should throw an error if the alarm is not found', async () => {
    const alarm = AlarmFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: alarm.id.value })).rejects.toThrow(
      AlarmNotFoundError,
    )
  })

  it('should throw an error if the alarm is already deactivated', async () => {
    const alarm = AlarmFaker.fake({ isActive: false })
    repository.findById.mockResolvedValue(alarm)

    await expect(useCase.execute({ id: alarm.id.value })).rejects.toThrow(
      AlarmAlreadyDeactivatedError,
    )
  })

  it('should deactivate the alarm and replace it in the repository', async () => {
    const alarm = AlarmFaker.fake({ isActive: true })
    repository.findById.mockResolvedValue(alarm)

    await useCase.execute({ id: alarm.id.value })

    expect(repository.replace).toHaveBeenCalledWith(alarm)
    expect(alarm.isActive.isFalse).toBe(true)
  })
})