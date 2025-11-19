import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import {
  AlertsRepository,
  DatetimeProvider,
  ParametersRepository,
  PdfProvider,
  StationsRepository,
} from '@/core/global/interfaces'
import { MeasurementsRepository } from '@/core/telemetry/interfaces'
import { StationReportUseCase } from '../station-report-use-case'
import { Station } from '@/core/telemetry/domain/entities/station'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { Measurement } from '@/core/telemetry/domain/entities/measurement'
import { Integer } from '@/core/global/domain/structures/integer'

const NUMBER_FORMATTER = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

describe('StationReportUseCase', () => {
  const fixedNow = new Date(2024, 5, 15, 12)

  let stationsRepository: MockProxy<StationsRepository>
  let measurementsRepository: MockProxy<MeasurementsRepository>
  let parametersRepository: MockProxy<ParametersRepository>
  let alertsRepository: MockProxy<AlertsRepository>
  let datetimeProvider: MockProxy<DatetimeProvider>
  let pdfProvider: MockProxy<PdfProvider>
  let useCase: StationReportUseCase

  let station: Station
  let parameter: Parameter

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedNow)

    stationsRepository = mock<StationsRepository>()
    measurementsRepository = mock<MeasurementsRepository>()
    parametersRepository = mock<ParametersRepository>()
    alertsRepository = mock<AlertsRepository>()
    datetimeProvider = mock<DatetimeProvider>()
    pdfProvider = mock<PdfProvider>()

    station = Station.create({
      id: 'station-01',
      name: 'Central Station',
      uid: 'UID-001',
      address: 'Rua A, 123',
      latitude: 10,
      longitude: 20,
      quantityOfParameters: 1,
    })
    stationsRepository.findById.mockResolvedValue(station)

    parameter = Parameter.create({
      id: 'station-parameter-01',
      name: 'Temperatura',
      code: 'TMP',
      unitOfMeasure: 'C',
      factor: 1,
      offset: 0,
      isActive: true,
      createdAt: fixedNow,
    })
    parametersRepository.findParametersByStationId.mockResolvedValue([parameter])

    alertsRepository.countAlertsCriticalByStationParameterId.mockResolvedValue(
      Integer.create(2),
    )
    alertsRepository.countAlertsWarningByStationParameterId.mockResolvedValue(
      Integer.create(1),
    )

    measurementsRepository.findManyMeasurementsByStationId.mockResolvedValue([])
    measurementsRepository.getMonthlyAverageByStationParameter.mockResolvedValue(0)

    datetimeProvider.getStartOf.mockImplementation(
      (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1),
    )
    datetimeProvider.getEndOf.mockImplementation((date: Date) => date)

    pdfProvider.generateStationReport.mockResolvedValue(Buffer.from('pdf-data'))

    useCase = new StationReportUseCase(
      stationsRepository,
      measurementsRepository,
      parametersRepository,
      alertsRepository,
      datetimeProvider,
      pdfProvider,
    )
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  it('should include hourly, daily and monthly measurements in the parameter tables', async () => {
    const measurementDates = {
      previousDay: new Date(2024, 4, 9, 9, 0, 0),
      currentDayFirst: new Date(2024, 4, 10, 10, 0, 0),
      currentDaySecond: new Date(2024, 4, 10, 10, 30, 0),
    }
    const measurements = [
      buildMeasurement({
        value: 18,
        date: measurementDates.previousDay,
        parameter,
        station,
      }),
      buildMeasurement({
        value: 10,
        date: measurementDates.currentDayFirst,
        parameter,
        station,
      }),
      buildMeasurement({
        value: 14,
        date: measurementDates.currentDaySecond,
        parameter,
        station,
      }),
    ]
    measurementsRepository.findManyMeasurementsByStationId.mockResolvedValue(
      measurements,
    )
    measurementsRepository.getMonthlyAverageByStationParameter.mockImplementation(
      async (_stationId, _parameterId, month) => month.value.getMonth() + 1,
    )

    await useCase.execute({ stationId: station.id.value })

    expect(pdfProvider.generateStationReport).toHaveBeenCalledTimes(1)
    const payload = pdfProvider.generateStationReport.mock.calls[0][0]
    const [hourlyTable, dailyTable, monthlyTable] =
      payload.parameterSections[0].tables

    expect(hourlyTable.rows).toEqual([
      { period: '09/05/2024 09:00', value: '18,00 C' },
      { period: '10/05/2024 10:00', value: '12,00 C' },
    ])

    expect(dailyTable.rows).toEqual([
      { period: '09/05/2024', value: '18,00 C' },
      { period: '10/05/2024', value: '12,00 C' },
    ])

    const expectedMonthlyRows = buildExpectedMonthlyRows(fixedNow, parameter.unitOfMeasure.value)
    expect(monthlyTable.rows).toEqual(expectedMonthlyRows)
    expect(measurementsRepository.getMonthlyAverageByStationParameter).toHaveBeenCalledTimes(
      12,
    )
  })

  it('should generate the PDF report with station metadata and alert counts', async () => {
    const pdfBuffer = Buffer.from('station-pdf')
    pdfProvider.generateStationReport.mockResolvedValue(pdfBuffer)

    const result = await useCase.execute({ stationId: station.id.value })

    expect(result).toBe(pdfBuffer)
    expect(pdfProvider.generateStationReport).toHaveBeenCalledTimes(1)
    const payload = pdfProvider.generateStationReport.mock.calls[0][0]

    expect(payload.headerTitle).toBe('Relatório de Estação de Monitoramento')
    expect(payload.brandName).toBe('tecsus')
    expect(payload.stationTitle).toContain(station.name.value)
    expect(payload.stationTitle).toContain(station.uid.value.value)
    expect(payload.parameterSections).toHaveLength(1)
    expect(payload.parameterSections[0].header).toContain(parameter.name.value)
    expect(payload.overviewDetails).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          label: 'Identificador',
          value: station.uid.value.value,
        }),
        expect.objectContaining({
          label: 'Parâmetros ativos',
          value: '1',
        }),
      ]),
    )
    expect(payload.alerts).toEqual({ critical: 2, warning: 1 })
    expect(payload.generatedAt.getTime()).toBe(fixedNow.getTime())
  })
})

function buildMeasurement({
  value,
  date,
  parameter,
  station,
}: {
  value: number
  date: Date
  parameter: Parameter
  station: Station
}): Measurement {
  return Measurement.create({
    value,
    createdAt: date,
    parameter: {
      id: parameter.id.value,
      entity: {
        name: parameter.name.value,
        unitOfMeasure: parameter.unitOfMeasure.value,
        stationId: station.id.value,
        stationName: station.name.value,
      },
    },
  })
}

function buildExpectedMonthlyRows(now: Date, unit: string) {
  const months: Date[] = []
  for (let i = 0; i < 12; i++) {
    months.push(new Date(now.getFullYear(), now.getMonth() - i, 1))
  }
  months.reverse()
  const latestMonths = months.slice(-6)

  return latestMonths.map((month) => ({
    period: `${pad(month.getMonth() + 1)}/${month.getFullYear()}`,
    value: `${NUMBER_FORMATTER.format(month.getMonth() + 1)} ${unit}`,
  }))
}

function pad(value: number): string {
  return String(value).padStart(2, '0')
}


