import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

import type { Broker } from '@/core/global/interfaces'
import { Integer } from '@/core/global/domain/structures/integer'
import type {
  MeasurementsRepository,
  ParametersRepository,
  ReadingsRepository,
} from '@/core/telemetry/interfaces'
import { ParseReadingsUseCase } from '@/core/telemetry/use-cases/parse-readings-use-case'
import { ParameterFaker } from '@/core/telemetry/domain/entities/fakers/parameter-faker'
import { Reading } from '@/core/telemetry/domain/entities/reading'
import { Measurement } from '@/core/telemetry/domain/entities/measurement'
import {
  MeasurementCreatedEvent,
  ReadingsCollectedEvent,
} from '@/core/telemetry/domain/events'

const FIXED_RECEIVED_AT = new Date('2024-01-01T00:00:00Z').getTime()

describe('Parse Readings Use Case', () => {
  let broker: MockProxy<Broker>
  let readingsRepository: MockProxy<ReadingsRepository>
  let measurementsRepository: MockProxy<MeasurementsRepository>
  let parametersRepository: MockProxy<ParametersRepository>
  let useCase: ParseReadingsUseCase

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})

    broker = mock<Broker>()
    readingsRepository = mock<ReadingsRepository>()
    measurementsRepository = mock<MeasurementsRepository>()
    parametersRepository = mock<ParametersRepository>()

    broker.publish.mockResolvedValue()
    readingsRepository.deleteMany.mockResolvedValue()
    measurementsRepository.createMany.mockResolvedValue()

    useCase = new ParseReadingsUseCase(
      broker,
      readingsRepository,
      measurementsRepository,
      parametersRepository,
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should return early when no readings are available', async () => {
    readingsRepository.findMany.mockResolvedValue([])

    await useCase.execute()

    expect(readingsRepository.findMany).toHaveBeenCalledOnce()
    expect(parametersRepository.findParameterByCode).not.toHaveBeenCalled()
    expect(measurementsRepository.createMany).not.toHaveBeenCalled()
    expect(readingsRepository.deleteMany).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should parse readings, persist measurements, delete readings and publish measurement events', async () => {
    const parameter = ParameterFaker.fake({
      id: 'parameter-1',
      code: 'PARAM-1',
      factor: 2,
      offset: 1,
    })

    const readings = [
      createReading('reading-1', parameter.code.value, 10),
      createReading('reading-2', parameter.code.value, 20),
    ]

    readingsRepository.findMany.mockResolvedValue(readings)
    parametersRepository.findParameterByCode.mockResolvedValue(parameter)

    await useCase.execute()

    expect(parametersRepository.findParameterByCode).toHaveBeenCalledTimes(
      readings.length,
    )

    const [persistedMeasurements] = measurementsRepository.createMany.mock.calls[0]
    expect(persistedMeasurements).toHaveLength(readings.length)
    persistedMeasurements.forEach((measurement, index) => {
      expect(measurement).toBeInstanceOf(Measurement)
      expect(measurement.dto.parameter.id).toBe(parameter.id.value)

      const reading = readings[index]
      const expectedValue =
        (reading.value.value * parameter.factor.value) / parameter.offset.value
      expect(measurement.dto.value).toBeCloseTo(expectedValue)
    })

    expect(readingsRepository.deleteMany).toHaveBeenCalledWith(
      readings.map((reading) => reading.id),
    )

    const publishedEvents = broker.publish.mock.calls.map(([event]) => event)
    expect(publishedEvents).toHaveLength(readings.length)
    publishedEvents.forEach((event) => {
      expect(event).toBeInstanceOf(MeasurementCreatedEvent)
    })
  })

  it('should ignore readings that fail during processing and still persist successful ones', async () => {
    const parameter = ParameterFaker.fake({
      id: 'parameter-1',
      code: 'PARAM-1',
      factor: 2,
      offset: 1,
    })

    const readings = [
      createReading('reading-1', parameter.code.value, 10),
      createReading('reading-2', parameter.code.value, 20),
    ]

    readingsRepository.findMany.mockResolvedValue(readings)
    parametersRepository.findParameterByCode
      .mockResolvedValueOnce(parameter)
      .mockResolvedValueOnce(null)

    await useCase.execute()

    const [persistedMeasurements] = measurementsRepository.createMany.mock.calls[0]
    expect(persistedMeasurements).toHaveLength(1)

    expect(readingsRepository.deleteMany).toHaveBeenCalledWith(
      readings.map((reading) => reading.id),
    )

    const measurementEvents = broker.publish.mock.calls
      .map(([event]) => event)
      .filter((event) => event instanceof MeasurementCreatedEvent)
    expect(measurementEvents).toHaveLength(1)
  })

  it('should enqueue another batch when the batch size limit is reached', async () => {
    const originalBatchSize = (ParseReadingsUseCase as any).BATCH_SIZE
    const reducedBatchSize = Integer.create(2)

    try {
      ;(ParseReadingsUseCase as any).BATCH_SIZE = reducedBatchSize

      const parameter = ParameterFaker.fake({
        id: 'parameter-batch',
        code: 'PARAM-BATCH',
        factor: 2,
        offset: 1,
      })

      const readings = [
        createReading('reading-1', parameter.code.value, 10),
        createReading('reading-2', parameter.code.value, 12),
      ]

      readingsRepository.findMany.mockResolvedValue(readings)
      parametersRepository.findParameterByCode.mockResolvedValue(parameter)

      await useCase.execute()

      const publishedEvents = broker.publish.mock.calls.map(([event]) => event)
      const measurementEvents = publishedEvents.filter(
        (event) => event instanceof MeasurementCreatedEvent,
      )
      expect(measurementEvents).toHaveLength(readings.length)
      expect(publishedEvents.at(-1)).toBeInstanceOf(ReadingsCollectedEvent)
    } finally {
      ;(ParseReadingsUseCase as any).BATCH_SIZE = originalBatchSize
    }
  })
})

function createReading(id: string, parameterCode: string, value: number): Reading {
  return Reading.create({
    id,
    stationUid: `station-${id}`,
    parameterCode,
    receivedAt: FIXED_RECEIVED_AT,
    value,
  })
}
