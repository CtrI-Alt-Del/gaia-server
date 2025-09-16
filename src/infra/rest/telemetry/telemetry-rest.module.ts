import { Module } from '@nestjs/common'
import {
  ActivateParameterController,
  CreateParameterController,
  DeactivateParameterController,
  EditParameterController,
  ListParameterController,
  CreateStationController
} from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateParameterController,
    DeactivateParameterController,
    EditParameterController,
    ListParameterController,
    ActivateParameterController,
    CreateStationController,
  ],
})
export class TelemetryRestModule {}
