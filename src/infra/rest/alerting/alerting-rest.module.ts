import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'

import { CacheProviderModule } from '@/infra/provision/cache/cache.porvider.module'
import { CreateAlarmsController } from './controllers/alarms/create-alarm.controller'
import { ActivateAlarmsController } from './controllers/alarms/activate-alarm.controller'
import { DeactivateAlarmsController } from './controllers/alarms/deactivate-alarm.controller'
import { UpdateAlarmController } from './controllers/alarms/update-alarm.controller'
import { ListAlarmsController } from './controllers/alarms/list-alarms.controller'
import { ListAlertsController } from './controllers/alerts/list-alerts.controller'
import { GetLastAlertsController } from './controllers/alerts/get-last-alerts.controller'
import { ReadAlertController } from './controllers/alerts/read-alert.controller'

import { CountAlertsByLevelController } from './controllers/alerts/count-alerts-by-level.controller'

@Module({
  imports: [DatabaseModule, CacheProviderModule],
  controllers: [
    CreateAlarmsController,
    ListAlarmsController,
    ActivateAlarmsController,
    DeactivateAlarmsController,
    UpdateAlarmController,
    ListAlertsController,
    GetLastAlertsController,
    ReadAlertController,
    CountAlertsByLevelController,
  ],
})
export class AlertingRestModule {}
