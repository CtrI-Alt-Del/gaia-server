import {
  AlertsRepository,
  DatetimeProvider,
  ParametersRepository,
  StationsRepository,
  UseCase,
} from '@/core/global/interfaces'
import { MeasurementsRepository } from '../interfaces'
import { Buffer } from 'node:buffer'
import { Id, Integer, Numeric, Timestamp } from '@/core/global/domain/structures'
import { ParameterDto } from '../domain/dtos'
import { StationNotFoundError } from '../domain/errors/station-not-found-error'
import { Measurement } from '../domain/entities/measurement'
import {
  generateStationReportPdf,
  ParameterSection,
} from './station-report-pdf'

type Request = {
  stationId: string
}

type MonthlyAverageEntry = {
  month: Timestamp
  parameterId: Id
  average: Numeric
}

const MAX_HOURLY_ROWS = 5
const MAX_DAILY_ROWS = 5
const MAX_MONTHLY_ROWS = 6

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

type TemporalGranularity = 'hour' | 'day'

export class StationReportUseCase implements UseCase<Request, Buffer> {
  constructor(
    private readonly stationsRepository: StationsRepository,
    private readonly measurementsRepository: MeasurementsRepository,
    private readonly parametersRepository: ParametersRepository,
    private readonly alertsRepository: AlertsRepository,
    private readonly datetimeProvider: DatetimeProvider,
  ) {}

  async execute(params: Request): Promise<Buffer> {
    const stationId = Id.create(params.stationId)
    const station = await this.stationsRepository.findById(stationId)

    if (!station) {
      throw new StationNotFoundError()
    }

    const parameters = await this.findParametersByStationId(stationId)

    const [criticalAlertsCount, warningAlertsCount] = await Promise.all([
      this.countAlertsCriticalByStationParameterId(stationId),
      this.countAlertsWarningByStationParameterId(stationId),
    ])

    const monthsAverages: MonthlyAverageEntry[] = []

    const months = await this.getLastMonths()

    for (const month of months) {
      for (const parameter of parameters) {
        if (!parameter.id) {
          continue
        }

        const avgValue = await this.getMonthlyAverageByStationParameter(
          stationId,
          Id.create(parameter.id),
          month,
        )

        monthsAverages.push({
          month,
          parameterId: Id.create(parameter.id),
          average: Numeric.create(avgValue),
        })
      }
    }

    const measurements =
      await this.measurementsRepository.findManyMeasurementsByStationId(stationId)

    const measurementGroups = this.groupMeasurementsByParameter(measurements)

    const generatedAt = new Date()
    const parameterSections = this.buildParameterSections({
      parameters,
      measurementGroups,
      monthsAverages,
    })

    const stationUid = station.uid.value.value
    const pdf = generateStationReportPdf({
      headerTitle: 'Relatório de Estação de Monitoramento',
      brandName: 'tecsus',
      stationTitle: `Estação: ${station.name.value} (${stationUid})`,
      overviewDetails: [
        { label: 'Identificador', value: stationUid },
        {
          label: 'Localização',
          value: this.formatCoordinates(
            station.coordinate.latitude.value,
            station.coordinate.longitude.value,
          ),
        },
        { label: 'Endereço', value: station.address.value },
        { label: 'Parâmetros ativos', value: `${parameters.length}` },
        { label: 'Data do relatório', value: this.formatDetailedDate(generatedAt) },
      ],
      alerts: {
        critical: criticalAlertsCount.value,
        warning: warningAlertsCount.value,
      },
      parameterSections,
      generatedAt,
    })

    return pdf
  }

  private async findParametersByStationId(stationId: Id): Promise<ParameterDto[]> {
    const parameters =
      await this.parametersRepository.findParametersByStationId(stationId)
    return parameters.map((parameter) => parameter.dto)
  }

  private async getMonthlyAverageByStationParameter(
    stationId: Id,
    parameterId: Id,
    month: Timestamp,
  ): Promise<number> {
    const avg = await this.measurementsRepository.getMonthlyAverageByStationParameter(
      stationId,
      parameterId,
      month,
    )
    return avg
  }

  private async countAlertsCriticalByStationParameterId(stationId: Id): Promise<Integer> {
    const count =
      await this.alertsRepository.countAlertsCriticalByStationParameterId(stationId)
    return count
  }

  private async countAlertsWarningByStationParameterId(stationId: Id): Promise<Integer> {
    const count =
      await this.alertsRepository.countAlertsWarningByStationParameterId(stationId)
    return count
  }

  private async getLastMonths(): Promise<Timestamp[]> {
    const now = new Date()
    const months: Timestamp[] = []

    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)

      const startDate = this.datetimeProvider.getStartOf(date)

      const timestamp = Timestamp.create(startDate)
      months.push(timestamp)
    }

    return months.reverse()
  }

  private groupMeasurementsByParameter(measurements: Measurement[]): Map<string, Measurement[]> {
    const groups = new Map<string, Measurement[]>()

    for (const measurement of measurements) {
      const parameterId = measurement.parameter.id.value
      if (!groups.has(parameterId)) {
        groups.set(parameterId, [])
      }
      groups.get(parameterId)?.push(measurement)
    }

    return groups
  }

  private buildParameterSections({
    parameters,
    measurementGroups,
    monthsAverages,
  }: {
    parameters: ParameterDto[]
    measurementGroups: Map<string, Measurement[]>
    monthsAverages: MonthlyAverageEntry[]
  }): ParameterSection[] {
    const validParameters = parameters.filter(
      (parameter): parameter is ParameterDto & { id: string } => Boolean(parameter.id),
    )

    return validParameters.map((parameter) => ({
      header: `Parâmetro: ${parameter.name}`,
      description: `Código: ${parameter.code} • Unidade: ${parameter.unitOfMeasure}`,
      tables: [
        {
          title: 'Média Horária',
          rows: this.buildTemporalRows(
            measurementGroups.get(parameter.id) ?? [],
            parameter.unitOfMeasure,
            'hour',
            MAX_HOURLY_ROWS,
          ),
        },
        {
          title: 'Média Diária',
          rows: this.buildTemporalRows(
            measurementGroups.get(parameter.id) ?? [],
            parameter.unitOfMeasure,
            'day',
            MAX_DAILY_ROWS,
          ),
        },
        {
          title: 'Média Mensal',
          rows: this.buildMonthlyRows(
            monthsAverages,
            parameter.id,
            parameter.unitOfMeasure,
            MAX_MONTHLY_ROWS,
          ),
        },
      ],
    }))
  }

  private buildTemporalRows(
    measurements: Measurement[],
    unit: string,
    granularity: TemporalGranularity,
    limit: number,
  ): Array<{ period: string; value: string }> {
    if (!measurements.length) {
      return []
    }

    const buckets = new Map<
      number,
      {
        sum: number
        count: number
        date: Date
      }
    >()

    for (const measurement of measurements) {
      const bucketDate = this.truncateDate(measurement.createdAt.value, granularity)
      const key = bucketDate.getTime()
      const bucket = buckets.get(key)
      if (bucket) {
        bucket.sum += measurement.value.value
        bucket.count += 1
      } else {
        buckets.set(key, {
          sum: measurement.value.value,
          count: 1,
          date: bucketDate,
        })
      }
    }

    const orderedBuckets = Array.from(buckets.values()).sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    )
    const limited = orderedBuckets.slice(0, limit).reverse()

    return limited.map((bucket) => ({
      period: granularity === 'hour' ? this.formatDateTime(bucket.date) : this.formatDate(bucket.date),
      value: `${this.formatNumber(bucket.sum / bucket.count)} ${unit}`,
    }))
  }

  private buildMonthlyRows(
    monthsAverages: MonthlyAverageEntry[],
    parameterId: string,
    unit: string,
    limit: number,
  ): Array<{ period: string; value: string }> {
    const filtered = monthsAverages
      .filter((entry) => entry.parameterId.value === parameterId)
      .sort((a, b) => b.month.value.getTime() - a.month.value.getTime())
      .slice(0, limit)
      .reverse()

    return filtered.map((entry) => ({
      period: this.formatMonth(entry.month.value),
      value: `${this.formatNumber(entry.average.value)} ${unit}`,
    }))
  }

  private truncateDate(date: Date, granularity: TemporalGranularity): Date {
    if (granularity === 'hour') {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0, 0)
    }

    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }

  private formatCoordinates(latitude: number, longitude: number): string {
    return `(${latitude.toFixed(6)}, ${longitude.toFixed(6)})`
  }

  private formatDate(date: Date): string {
    const day = this.pad(date.getDate())
    const month = this.pad(date.getMonth() + 1)
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  private formatDateTime(date: Date): string {
    return `${this.formatDate(date)} ${this.formatTime(date)}`
  }

  private formatDetailedDate(date: Date): string {
    return `${this.formatDate(date)} às ${this.formatTime(date)}`
  }

  private formatMonth(date: Date): string {
    return `${this.pad(date.getMonth() + 1)}/${date.getFullYear()}`
  }

  private formatTime(date: Date): string {
    return `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}`
  }

  private formatNumber(value: number): string {
    return NUMBER_FORMATTER.format(Number.isFinite(value) ? value : 0)
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0')
  }
}
