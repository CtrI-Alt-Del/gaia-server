import { mock, MockProxy } from "vitest-mock-extended"
import { AlarmsRepository } from "../../interfaces"
import { UpdateAlarmUseCase } from "../update-alarm-use-case"
import { AlarmFaker } from "../../domain/entities/fakers/alarm-faker"
import { Id } from "@/core/global/domain/structures"
import { AlarmNotFoundError } from "@/core/telemetry/domain/errors/alarm-not-found-error"

describe('UpdateAlarmUseCase', () => {
  let alarmRepository: MockProxy<AlarmsRepository>
  let useCase: UpdateAlarmUseCase

  beforeEach(() => {
    alarmRepository = mock<AlarmsRepository>()
    useCase = new UpdateAlarmUseCase(alarmRepository)
  })

  it('should update a alarm and save it to the repository', async () => {
    const existingAlarm = AlarmFaker.fake({})
    const updatedAlarm = AlarmFaker.fake({})

    const updateData = {
      message: 'Test Alarm',
      level: 'WARNING',
      rule: {
        threshold: 1000,
        operation: "LESS_THAN"
      },
    }

    alarmRepository.findById.mockResolvedValue(existingAlarm)
    alarmRepository.replace.mockResolvedValue()

    vi.spyOn(existingAlarm, 'update').mockReturnValue(updatedAlarm)

    const result = await useCase.execute({
      id: existingAlarm.id.value,
      data: updateData,
    })

    expect(alarmRepository.findById).toHaveBeenCalledWith(
      Id.create(existingAlarm.id.value),
    )
    expect(existingAlarm.update).toHaveBeenCalledWith(updateData)
    expect(alarmRepository.replace).toHaveBeenCalledWith(updatedAlarm)
    expect(result).toEqual(updatedAlarm.dto)
  })

  it('should throw an error if the alarm is not found', async () => {
    const alarmId = 'non-existent-id'
    const updateData = { message: 'New Message' }

    alarmRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ id: alarmId, data: updateData })).rejects.toThrow(
      AlarmNotFoundError,
    )
  })
})
