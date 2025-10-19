import { Delete, Inject, Param } from '@nestjs/common'
import { AlarmsController } from './alarms.controller'
import { DatabaseModule } from '@/infra/database/database.module'
import { AlarmsRepository } from '@/core/alerting/interfaces'
import { DeactivateAlarmsUseCase } from '@/core/alerting/use-cases/deactivate-alarms-use-case'

@AlarmsController(':alarmId')
export class DeactivateAlarmsController {
  constructor(
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly repository: AlarmsRepository,
  ) {}

  @Delete()
  async handle(@Param('alarmId') alarmId: string) {
    const useCase = new DeactivateAlarmsUseCase(this.repository)
    return await useCase.execute({ id: alarmId })
  }
}
