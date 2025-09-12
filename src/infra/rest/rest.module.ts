import { Module } from '@nestjs/common'

import { TelemetryRestModule } from './telemetry/telemetry-rest.module'
import { MembershipRestModule } from './membership/membership-rest.module'

@Module({
  imports: [TelemetryRestModule, MembershipRestModule],
})
export class RestModule {}
