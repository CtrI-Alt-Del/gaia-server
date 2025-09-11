import { Module } from '@nestjs/common'
import { TelemetryRestModule } from './telemetry/telemetry-rest.module'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [TelemetryRestModule],
})
export class RestModule {}
