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
import { Measurement } from '../domain/entities/measurement'
import { MeasurementCreatedEvent, ReadingsCollectedEvent } from '../domain/events'

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
    try {
      const readings = await this.readingsRepository.findMany(
        ParseReadingsUseCase.BATCH_SIZE,
      )
      console.log(
        'readins ids',
        readings.map((reading) => reading.id),
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
    } catch (error) {
      console.error('Error parsing readings:', error)
    }
  }

  private async process(reading: Reading) {
    try {
      const parameter = await this.findParameter(
        reading.parameterCode,
        reading.stationUid,
      )
      if (!parameter) return
      const measurement = parameter.parseReading(reading)
      const event = new MeasurementCreatedEvent({
        measurementValue: measurement.value.value,
        stationParameterId: parameter.id.value,
      })
      await this.updateStationLastReadingDate(parameter.id)
      console.log('CADE?')
      await this.broker.publish(event)
      console.log(`published measurement: ${measurement.value.value}`)
      return measurement
    } catch (error) {
      console.error('Error processing reading:', error)
    }
  }

  private handleMeasumentPromises(
    promises: PromiseSettledResult<Measurement | undefined>[],
  ): Measurement[] {
    const measurements: Measurement[] = []

    for (const promise of promises) {
      if (promise.status === 'fulfilled') {
        if (!promise.value) continue
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

  async updateStationLastReadingDate(stationParameterId: Id) {
    const station = await this.findStation(stationParameterId)
    if (!station) return
    station.updateLastReadAt()
    await this.stationsRepository.replace(station)
  }

  async findStation(stationParameterId: Id) {
    const station = await this.stationsRepository.findByParameterId(stationParameterId)
    return station
  }

  private async findParameter(parameterCode: Text, stationUid: Text) {
    const parameter = await this.parametersRepository.findParameterByCodeAndStationUid(
      parameterCode,
      stationUid,
    )
    return parameter
  }
}
