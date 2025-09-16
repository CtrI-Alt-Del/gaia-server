import { Module } from '@nestjs/common'
import {
  CreateParameterController,
  EditParameterController,
  ListParameterController,
} from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateParameterController,
    EditParameterController,
    ListParameterController,
  ],
})
export class TelemetryRestModule {}
