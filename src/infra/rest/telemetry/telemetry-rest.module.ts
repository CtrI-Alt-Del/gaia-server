import { Module } from '@nestjs/common'
import { CreateParameterController, EditParameterController } from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateParameterController,EditParameterController],
})
export class TelemetryRestModule {}
