import { AlarmsRepository } from '../interfaces/alarms-repository'
import { UseCase } from '@/core/global/interfaces'
import { AlarmDto } from '../dtos/alarm.dto'
import { Id } from '@/core/global/domain/structures'
import { Alarm } from '../domain/entities/alarm'
import { AlarmNotFoundError } from '@/core/telemetry/domain/errors/alarm-not-found-error'

type UseCaseInput = { data: Partial<AlarmDto>; id: string }

export class UpdateAlarmUseCase implements UseCase<UseCaseInput, AlarmDto> {
  constructor(private readonly repository: AlarmsRepository) {}

  async execute({ id, data }: UseCaseInput): Promise<AlarmDto> {
    const existingAlarm = await this.findById(Id.create(id))
    const updatedAlarm = existingAlarm.update(data)
    await this.repository.replace(updatedAlarm)
    return updatedAlarm.dto
  }
  async findById(id: Id): Promise<Alarm> {
    const alarm = await this.repository.findById(id)
    if (!alarm) {
      throw new AlarmNotFoundError()
    }
    return alarm
  }
}
