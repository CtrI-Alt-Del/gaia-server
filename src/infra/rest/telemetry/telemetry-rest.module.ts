import { Module } from '@nestjs/common'
import {
  ActivateParameterController,
  CreateParameterController,
  DeactivateParameterController,
  UpdateParameterController,
  ListParameterController,
  CreateStationController,
  ListStationsController,
  UpdateStationController,
  DeactivateStationController,
  ActivateStationController,
} from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateParameterController,
    DeactivateParameterController,
    UpdateParameterController,
    ListParameterController,
    ActivateParameterController,
    CreateStationController,
    ListStationsController,
    UpdateStationController,
    DeactivateStationController,
    ActivateStationController,
  ],
})
export class TelemetryRestModule {}
