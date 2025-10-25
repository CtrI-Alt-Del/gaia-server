import { mock, MockProxy } from 'vitest-mock-extended'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { Broker, StationsRepository, UseCase } from '@/core/global/interfaces'
import { MongoMeasurementsRepository } from '@/core/telemetry/interfaces'
import { MeasurementRepository } from '@/core/telemetry/interfaces/measurement-repository'
import { TransferRawMeasurementsUseCase } from '@/core/telemetry/use-cases/transfer-raw-measurements-use-case'

import { Id } from '@/core/global/domain/structures'

const mockParameterDetails = (paramName: string, factor = 1, offset = 1) => ({
  station: {
    id: Id.create('fake-station-id'),
    name: { value: 'Fake Station' },
  },
  parameter: {
    id: Id.create(`fake-param-id-for-${paramName}`),
    name: { value: paramName },
    unitOfMeasure: { value: 'unit' },
    factor: { value: factor },
    offset: { value: offset },
  },
  stationParameterId: Id.create(`fake-station-param-id-for-${paramName}`),
})

const mockRawMeasurement = (id: string, data: Record<string, any>) => ({
  _id: id,
  uid: 'station-uid-001',
  uxt: 1678886400,
  receivedAt: new Date(),
  topic: 'fake/topic',
  ...data,
})

describe('TransferRawMeasurementsUseCase', () => {
  let broker: MockProxy<Broker>
  let mongoMeasurmentsRepository: MockProxy<MongoMeasurementsRepository>
  let measurementsRepository: MockProxy<MeasurementRepository>
  let stationsRepository: MockProxy<StationsRepository>
  let useCase: TransferRawMeasurementsUseCase

  let consoleLogSpy: any
  let consoleWarnSpy: any

  beforeEach(() => {
    broker = mock<Broker>()
    mongoMeasurmentsRepository = mock<MongoMeasurementsRepository>()
    measurementsRepository = mock<MeasurementRepository>()
    stationsRepository = mock<StationsRepository>()

    useCase = new TransferRawMeasurementsUseCase(
      broker,
      mongoMeasurmentsRepository,
      measurementsRepository,
      stationsRepository,
    )

    vi.mock('@/core/telemetry/domain/entities/measurement', async (importOriginal) => {
      const mod =
        (await importOriginal()) as typeof import('@/core/telemetry/domain/entities/measurement')
      return {
        ...mod,
        Measurement: {
          ...mod.Measurement,
          create: vi.fn((dto) => ({ dto })),
        },
      }
    })

    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  // --- Teste 1: Caminho Feliz ---
  it('should process valid raw measurements, save them, mark as processed, and publish events', async () => {
    const rawMeasurement = mockRawMeasurement('mongo-id-1', {
      temperature: 25,
      humidity: 60,
    })
    const tempDetails = mockParameterDetails('temperature', 10, 1) // factor 10
    const humidDetails = mockParameterDetails('humidity', 1, 1)

    mongoMeasurmentsRepository.findUnprocessed.mockResolvedValue([rawMeasurement])
    stationsRepository.findStationParameterDetails
      .mockResolvedValueOnce(tempDetails)
      .mockResolvedValueOnce(humidDetails)

    await useCase.execute()

    expect(measurementsRepository.createMany).toHaveBeenCalledTimes(1)
    const createdMeasurements = measurementsRepository.createMany.mock.calls[0][0]
    expect(createdMeasurements).toHaveLength(2)
    expect(createdMeasurements[0].dto.value).toBe(250) // 25 * 10 / 1
    expect(createdMeasurements[1].dto.value).toBe(60) // 60 * 1 / 1

    // Verifica se marcou como processado (agora com Array.from(Set))
    expect(mongoMeasurmentsRepository.deleteProcessed).toHaveBeenCalledWith([
      'mongo-id-1',
    ]) // O Set removeu o duplicado

    expect(broker.publish).toHaveBeenCalledTimes(2)
    expect(broker.publish.mock.calls[0][0].payload.measurementValue).toBe(250)
    expect(broker.publish.mock.calls[1][0].payload.measurementValue).toBe(60)
  })

  // --- Teste 2: Nenhuma Medição ---
  it('should do nothing if no raw measurements are found', async () => {
    mongoMeasurmentsRepository.findUnprocessed.mockResolvedValue([])
    await useCase.execute()
    expect(consoleLogSpy).toHaveBeenCalledWith('No raw measurements to process.')
    expect(measurementsRepository.createMany).not.toHaveBeenCalled()
    expect(mongoMeasurmentsRepository.deleteProcessed).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  // --- Teste 3: Dados Brutos Inválidos (Campos Faltando) ---
  it('should skip a raw measurement with missing required fields (e.g., uid)', async () => {
    const invalidRaw = {
      _id: 'invalid-id',
      uxt: 1678886400,
      receivedAt: new Date(),
      temperature: 20,
    } // Sem uid

    mongoMeasurmentsRepository.findUnprocessed.mockResolvedValue([invalidRaw as any])

    await useCase.execute()

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skipping raw measurement with missing required fields: invalid-id',
    )
    expect(measurementsRepository.createMany).not.toHaveBeenCalled()
    expect(mongoMeasurmentsRepository.deleteProcessed).not.toHaveBeenCalled()
  })

  // --- Teste 4: Parâmetro com Valor Nulo ---
  it('should skip a parameter if its value is null or undefined', async () => {
    const rawMeasurement = mockRawMeasurement('mongo-id-2', {
      temperature: 30,
      humidity: null, // Valor nulo
    })
    const tempDetails = mockParameterDetails('temperature', 1, 1)

    mongoMeasurmentsRepository.findUnprocessed.mockResolvedValue([rawMeasurement])
    stationsRepository.findStationParameterDetails.mockResolvedValue(tempDetails)

    await useCase.execute()

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skipping parameter humidity with null or undefined value in raw measurement: mongo-id-2',
    )
    expect(stationsRepository.findStationParameterDetails).toHaveBeenCalledTimes(1) // Foi chamado apenas para 'temperature'

    expect(measurementsRepository.createMany).toHaveBeenCalledTimes(1)
    const createdMeasurements = measurementsRepository.createMany.mock.calls[0][0]
    expect(createdMeasurements).toHaveLength(1)
    expect(createdMeasurements[0].dto.parameterName).toBe('temperature')

    // Deve marcar o 'mongo-id-2' como processado
    expect(mongoMeasurmentsRepository.deleteProcessed).toHaveBeenCalledWith([
      'mongo-id-2',
    ])

    expect(broker.publish).toHaveBeenCalledTimes(1)
  })

  // --- Teste 5: Parâmetro Desconhecido ---
  it('should skip a parameter if details are not found', async () => {
    const rawMeasurement = mockRawMeasurement('mongo-id-3', {
      temperature: 22,
      'unknown-param': 123,
    })
    const tempDetails = mockParameterDetails('temperature', 1, 1)

    mongoMeasurmentsRepository.findUnprocessed.mockResolvedValue([rawMeasurement])
    stationsRepository.findStationParameterDetails
      .mockResolvedValueOnce(tempDetails)
      .mockResolvedValueOnce(null)

    await useCase.execute()

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'No parameter details found for station station-uid-001 and parameter unknown-param. Skipping.',
    )
    expect(stationsRepository.findStationParameterDetails).toHaveBeenCalledTimes(2)

    expect(measurementsRepository.createMany).toHaveBeenCalledTimes(1)
    const createdMeasurements = measurementsRepository.createMany.mock.calls[0][0]
    expect(createdMeasurements).toHaveLength(1)
    expect(createdMeasurements[0].dto.parameterName).toBe('temperature')

    expect(mongoMeasurmentsRepository.deleteProcessed).toHaveBeenCalledWith([
      'mongo-id-3',
    ])
    expect(broker.publish).toHaveBeenCalledTimes(1)
  })

  // --- Teste 6: Processamento Múltiplo (ATUALIZADO) ---
  it('should process multiple raw measurements in one batch', async () => {
    const raw1 = mockRawMeasurement('mongo-id-A', { temperature: 10 })
    const raw2 = mockRawMeasurement('mongo-id-B', { humidity: 50 })

    const tempDetails = mockParameterDetails('temperature', 1, 1)
    const humidDetails = mockParameterDetails('humidity', 2, 1) // factor 2

    mongoMeasurmentsRepository.findUnprocessed.mockResolvedValue([raw1, raw2])
    stationsRepository.findStationParameterDetails
      .mockResolvedValueOnce(tempDetails)
      .mockResolvedValueOnce(humidDetails)

    await useCase.execute()

    // Agora, createMany é chamado APENAS UMA VEZ com todas as medições
    expect(measurementsRepository.createMany).toHaveBeenCalledTimes(1)
    const createdMeasurements = measurementsRepository.createMany.mock.calls[0][0]
    expect(createdMeasurements).toHaveLength(2)

    // Verifica se os dados das duas medições estão corretos
    expect(createdMeasurements[0].dto.value).toBe(10) // temp
    expect(createdMeasurements[1].dto.value).toBe(100) // humid (50 * 2 / 1)

    // markAsProcessed é chamado APENAS UMA VEZ com todos os IDs
    expect(mongoMeasurmentsRepository.deleteProcessed).toHaveBeenCalledTimes(1)
    expect(mongoMeasurmentsRepository.deleteProcessed).toHaveBeenCalledWith([
      'mongo-id-A',
      'mongo-id-B',
    ]) // Ordem pode variar

    // Broker é chamado para cada medição
    expect(broker.publish).toHaveBeenCalledTimes(2)
    expect(broker.publish.mock.calls[0][0].payload.measurementValue).toBe(10)
    expect(broker.publish.mock.calls[1][0].payload.measurementValue).toBe(100)
  })

  // --- NOVO Teste 7: Garante que IDs não são marcados se todos os params falharem ---
  it('should not mark an ID as processed if all its parameters are invalid', async () => {
    const rawMeasurement = mockRawMeasurement('mongo-id-4', {
      humidity: null,
      'unknown-param': 123,
    })

    mongoMeasurmentsRepository.findUnprocessed.mockResolvedValue([rawMeasurement])
    stationsRepository.findStationParameterDetails.mockResolvedValue(null) // Para unknown-param

    await useCase.execute()

    // Verifica se os avisos foram chamados
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skipping parameter humidity with null or undefined value in raw measurement: mongo-id-4',
    )
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'No parameter details found for station station-uid-001 and parameter unknown-param. Skipping.',
    )

    // NADA deve ser salvo ou marcado
    expect(measurementsRepository.createMany).not.toHaveBeenCalled()
    expect(mongoMeasurmentsRepository.deleteProcessed).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })
})
