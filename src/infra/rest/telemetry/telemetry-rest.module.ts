import { Module } from '@nestjs/common'
import {
  CreateParameterController,
  DeactivateParameterController,
  EditParameterController,
  ListParameterController,
} from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateParameterController,
    DeactivateParameterController,
    EditParameterController,
    ListParameterController,
  ],
})
export class TelemetryRestModule {}
