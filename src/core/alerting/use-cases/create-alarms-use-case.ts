import { AlarmsRepository } from '@/core/alerting/interfaces'
import { UseCase } from '@/core/global/interfaces'
import { AlarmDto } from '../dtos/alarm.dto'
import { Alarm } from '../domain/entities/alarm'

export class CreateAlarmUseCase implements UseCase<AlarmDto, AlarmDto> {
  constructor(private readonly repository: AlarmsRepository) {}

  async execute(data: AlarmDto): Promise<AlarmDto> {
    const alarm = Alarm.create(data)
    await this.repository.add(alarm)
    return alarm.dto
  }
}
