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
  StationReportController,
} from './controllers'
import { DatabaseModule } from '@/infra/database/database.module'
import { DatetimeProviderModule } from '@/infra/provision/datetime/datetime-provider.module'
import { PdfProviderModule } from '@/infra/provision/pdf/pdf-provider.module'

@Module({
  imports: [DatabaseModule, DatetimeProviderModule, PdfProviderModule],
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
    StationReportController,
  ],
})
export class TelemetryRestModule {}
