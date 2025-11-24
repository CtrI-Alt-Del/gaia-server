import { Module } from '@nestjs/common'

import { TelemetryRestModule } from './telemetry/telemetry-rest.module'
import { MembershipRestModule } from './membership/membership-rest.module'
import { AlertingRestModule } from './alerting/alerting-rest.module'
import { CheckHealthController } from './check-health.controller'
import { EnvProviderModule } from '../provision/env/env-provider.module'

@Module({
  controllers: [CheckHealthController],
  imports: [
    EnvProviderModule,
    TelemetryRestModule,
    MembershipRestModule,
    AlertingRestModule,
  ],
})
export class RestModule {}
