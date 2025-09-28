import { Inject, Param, Patch } from '@nestjs/common'
import { AlarmsController } from './alarms.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { AlarmsRepository } from '@/core/global/interfaces'
import { ActivateAlarmUseCase } from '@/core/alerting/use-cases/activate-alarm-use-case'

@AlarmsController(':alarmId')
export class ActivateAlarmsController {
  constructor(
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly repository: AlarmsRepository,
  ) {}

  @Patch()
  async handle(@Param('alarmId') alarmId: string) {
    const useCase = new ActivateAlarmUseCase(this.repository)
    return await useCase.execute({ id: alarmId })
  }
}
