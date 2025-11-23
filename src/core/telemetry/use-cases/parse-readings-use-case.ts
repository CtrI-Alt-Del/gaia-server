import {
  Broker,
  ParametersRepository,
  StationsRepository,
} from '@/core/global/interfaces'
import { MeasurementsRepository, ReadingsRepository } from '@/core/telemetry/interfaces'
import { UseCase } from '@/core/global/interfaces'
import { Integer } from '@/core/global/domain/structures/integer'
import { Id, Text } from '@/core/global/domain/structures'
import { Reading } from '../domain/entities/reading'
import { ParameterNotFoundError } from '../domain/errors/parameter-not-found-error'
import { Parameter } from '../domain/entities/parameter'
import { Measurement } from '../domain/entities/measurement'
import { MeasurementCreatedEvent, ReadingsCollectedEvent } from '../domain/events'
import { StationNotFoundError } from '../domain/errors/station-not-found-error'

export class ParseReadingsUseCase implements UseCase<void, void> {
  private static readonly BATCH_SIZE = Integer.create(1000)

  constructor(
    private readonly broker: Broker,
    private readonly readingsRepository: ReadingsRepository,
    private readonly measurementsRepository: MeasurementsRepository,
    private readonly parametersRepository: ParametersRepository,
    private readonly stationsRepository: StationsRepository,
  ) {}

  async execute(): Promise<void> {
    const readings = await this.readingsRepository.findMany(
      ParseReadingsUseCase.BATCH_SIZE,
    )
    console.log(`Found ${readings.length} readings`)
    if (readings.length === 0) return

    const promises = await Promise.allSettled(
      readings.map((reading) => this.process(reading)),
    )
    const measurements = this.handleMeasumentPromises(promises)

    await this.measurementsRepository.createMany(measurements)
    console.log(`Created ${measurements.length} measurements`)
    await this.readingsRepository.deleteMany(readings.map((reading) => reading.id))

    if (readings.length >= ParseReadingsUseCase.BATCH_SIZE.value) {
      await this.broker.publish(new ReadingsCollectedEvent())
    }
  }

  private async process(reading: Reading): Promise<Measurement> {
    const parameter = await this.findParameter(reading.parameterCode, reading.stationUid)
    const measurement = parameter.parseReading(reading)
    console.log(`measurement: ${measurement.value.value}`)
    const event = new MeasurementCreatedEvent({
      measurementValue: measurement.value.value,
      stationParameterId: parameter.id.value,
    })
    await this.updateStationLastReadingDate(parameter.id.value)
    await this.broker.publish(event)
    return measurement
  }

  private handleMeasumentPromises(
    promises: PromiseSettledResult<Measurement>[],
  ): Measurement[] {
    const measurements: Measurement[] = []

    for (const promise of promises) {
      if (promise.status === 'fulfilled') {
        measurements.push(promise.value)
      }
      if (promise.status === 'rejected') {
        console.log('Error parsing reading')
        console.log('Reason', promise.reason)
        console.log('Parameter id', promise.reason.parameterName)
        console.log('Reading value', promise.reason.readingValue)
      }
    }
    return measurements
  }

  async updateStationLastReadingDate(stationParameterId: string) {
    const station = await this.findStation(Id.create(stationParameterId))
    station.updateLastReadAt()
    await this.stationsRepository.replace(station)
  }

  async findStation(stationParameterId: Id) {
    const station = await this.stationsRepository.findByParameterId(stationParameterId)
    if (!station) throw new StationNotFoundError()
    return station
  }

  private async findParameter(parameterCode: Text, stationUid: Text): Promise<Parameter> {
    const parameter = await this.parametersRepository.findParameterByCodeAndStationUid(
      parameterCode,
      stationUid,
    )
    if (!parameter) {
      throw new ParameterNotFoundError()
    }
    return parameter
  }
}
