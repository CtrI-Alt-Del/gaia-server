import type {
  MeasurementsRepository,
  ParametersRepository,
  StationsRepository,
} from '@/core/telemetry/interfaces'
import type {
  AlertsRepository,
  DatetimeProvider,
  PdfProvider,
} from '@/core/global/interfaces'
import { StationReportUseCase } from '@/core/telemetry/use-cases'
import { DatabaseModule } from '@/infra/database/database.module'
import { StationsController } from '@/infra/rest/telemetry/controllers/stations/stations.controller'
import { DEPENDENCIES } from '@/infra/constants/dependencies'
import { Get, Inject, Param, StreamableFile } from '@nestjs/common'

@StationsController('report')
export class StationReportController {
  constructor(
    @Inject(DatabaseModule.STATIONS_REPOSITORY)
    private readonly stationsRepository: StationsRepository,
    @Inject(DatabaseModule.MEASUREMENTS_REPOSITORY)
    private readonly measurementsRepository: MeasurementsRepository,
    @Inject(DatabaseModule.PARAMETERS_REPOSITORY)
    private readonly parametersRepository: ParametersRepository,
    @Inject(DatabaseModule.ALERTS_REPOSITORY)
    private readonly alertsRepository: AlertsRepository,
    @Inject(DEPENDENCIES.provision.datetimeProvider)
    private readonly datetimeProvider: DatetimeProvider,
    @Inject(DEPENDENCIES.provision.pdfProvider)
    private readonly pdfProvider: PdfProvider,
  ) {}
  @Get(':stationId')
  async handle(@Param('stationId') stationId: string) {
    const useCase = new StationReportUseCase(
      this.stationsRepository,
      this.measurementsRepository,
      this.parametersRepository,
      this.alertsRepository,
      this.datetimeProvider,
      this.pdfProvider,
    )

    const pdf = await useCase.execute({ stationId })
    const filename = `station-${stationId}-report.pdf`

    return new StreamableFile(pdf, {
      type: 'application/pdf',
      disposition: `inline; filename="${filename}"`,
      length: pdf.length,
    })
  }
}
