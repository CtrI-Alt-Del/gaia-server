import { Module } from '@nestjs/common'

import { TelemetryRestModule } from './telemetry/telemetry-rest.module'
import { MembershipRestModule } from './membership/membership-rest.module'
import { AlertingRestModule } from './alerting/alerting-rest.module'
import { DashboardRestModule } from './dashboard/dashboard-rest.module'
import { CheckHealthController } from './check-health.controller'

@Module({
  controllers: [CheckHealthController],
  imports: [TelemetryRestModule, MembershipRestModule, AlertingRestModule, DashboardRestModule],
})
export class RestModule {}
