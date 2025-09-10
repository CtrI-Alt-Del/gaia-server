import { Module } from '@nestjs/common'
import { CreateParameterController } from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateParameterController],
})
export class TelemetryRestModule {}
