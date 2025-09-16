import { Module } from '@nestjs/common'
import {
  ActivateParameterController,
  CreateParameterController,
  DeactivateParameterController,
  EditParameterController,
  ListParameterController,
  CreateStationController,
  ListStationsController,
  EditStationController,
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
    EditStationController,
  ],
})
export class TelemetryRestModule {}
