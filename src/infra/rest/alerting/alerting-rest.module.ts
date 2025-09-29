import { DatabaseModule } from '@/infra/database/database.module'
import { QueueModule } from '@/infra/queue/queue.module'
import { Module } from '@nestjs/common'
import { CreateAlarmsController } from './controllers/alarm/create-alarm.controller'
import { ActivateAlarmsController } from './controllers/alarm/activate-alarm.controller'
import { DeactivateAlarmsController } from './controllers/alarm/deactivate-alarm.controller'
import { UpdateAlarmController } from './controllers/alarm/update-alarm.controller'
import { ListAlarmsController } from './controllers/alarm/list-alarms.controller'

@Module({
  imports: [DatabaseModule, QueueModule],
  controllers: [
    CreateAlarmsController,
    ListAlarmsController,
    ActivateAlarmsController,
    DeactivateAlarmsController,
    UpdateAlarmController,
  ],
})
export class AlertingRestModule {}
