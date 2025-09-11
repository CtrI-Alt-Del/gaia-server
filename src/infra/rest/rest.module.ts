import { Module } from '@nestjs/common'
import { TelemetryRestModule } from './telemetry/telemetry-rest.module'

@Module({
  imports: [TelemetryRestModule],
})
export class RestModule {}
