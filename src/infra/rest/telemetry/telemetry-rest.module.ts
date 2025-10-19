import { Module } from '@nestjs/common'
import {
  ActivateParameterController,
  CreateParameterController,
  DeactivateParameterController,
  UpdateParameterController,
  ListParameterController,
  GetStationParametersController,
  CreateStationController,
  ListStationsController,
  UpdateStationController,
  DeactivateStationController,
  ActivateStationController,
  GetStationDetailsController,
  ListMeasurementController,
  ListStationsByCoordsController,
  CountStationsController,
} from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CountStationsController,
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
    GetStationDetailsController,
    GetStationParametersController,
    ListStationsByCoordsController,
    ListMeasurementController,
  ],
})
export class TelemetryRestModule {}
