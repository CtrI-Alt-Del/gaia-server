import { DatabaseModule } from '@/infra/database/database.module'
import { QueueModule } from '@/infra/queue/queue.module'
import { Module } from '@nestjs/common'
import { CreateAlarmsController } from './controllers/alarms/create-alarm.controller'
import { ActivateAlarmsController } from './controllers/alarms/activate-alarm.controller'
import { DeactivateAlarmsController } from './controllers/alarms/deactivate-alarm.controller'
import { UpdateAlarmController } from './controllers/alarms/update-alarm.controller'
import { ListAlarmsController } from './controllers/alarms/list-alarms.controller'
import { ListAlertsController } from './controllers/alerts/list-alerts.controller'
import { CountAlertsByLevelController } from './controllers/alerts/count-alerts-by-level.controller'

@Module({
  imports: [DatabaseModule, QueueModule],
  controllers: [
    CreateAlarmsController,
    ListAlarmsController,
    ActivateAlarmsController,
    DeactivateAlarmsController,
    UpdateAlarmController,
    ListAlertsController,
    CountAlertsByLevelController,
  ],
})
export class AlertingRestModule {}
