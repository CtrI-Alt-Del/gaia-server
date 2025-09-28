import { Delete, Inject, Param } from "@nestjs/common"
import { AlarmController } from "./alarm.controller"
import { DatabaseModule } from "@/infra/database/database.module"
import { AlarmsRepository } from "@/core/alerting/interfaces"
import { DeactivateAlarmUseCase } from "@/core/alerting/use-cases/deactivate-alarm-use-case"

@AlarmController(':alarmId')
export class DeactivateAlarmController {
  constructor(
    @Inject(DatabaseModule.ALARMS_REPOSITORY)
    private readonly repository: AlarmsRepository,
  ) {}

  @Delete()
  async handle(@Param('alarmId') alarmId: string) {
    const useCase = new DeactivateAlarmUseCase(this.repository)
    return await useCase.execute({ id: alarmId })
  }
}