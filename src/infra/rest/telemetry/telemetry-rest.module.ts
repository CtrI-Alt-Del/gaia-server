import { Module } from '@nestjs/common'
import {
  ActivateParameterController,
  CreateParameterController,
  DeactivateParameterController,
  EditParameterController,
  ListParameterController,
  CreateStationController,
  ListStationsController,
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
    ListStationsController,
  ],
})
export class TelemetryRestModule {}
