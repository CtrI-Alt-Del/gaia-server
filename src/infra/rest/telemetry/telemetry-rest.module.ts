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
  DeactivateStationController,
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
    DeactivateStationController,

  ],
})
export class TelemetryRestModule {}
