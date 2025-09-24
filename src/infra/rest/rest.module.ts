import { Module } from '@nestjs/common'

import { TelemetryRestModule } from './telemetry/telemetry-rest.module'
import { MembershipRestModule } from './membership/membership-rest.module'
import { AlertingRestModule } from './alerting/alerting-rest.module'

@Module({
  imports: [TelemetryRestModule, MembershipRestModule, AlertingRestModule],
})
export class RestModule {}
