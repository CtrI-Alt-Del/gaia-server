import { Broker, StationsRepository, UseCase } from '@/core/global/interfaces'
import { MeasurementDto } from '@/core/telemetry/domain/dtos/measurement-dto'
import { Measurement } from '@/core/telemetry/domain/entities/measurement'
import { MeasurementCreatedEvent } from '@/core/telemetry/domain/events'
import { MongoMeasurementsRepository } from '@/core/telemetry/interfaces'
import { MeasurementRepository } from '@/core/telemetry/interfaces/measurement-repository'

export class TransferRawMeasurementsUseCase implements UseCase<void, void> {
  constructor(
    private readonly broker: Broker,
    private readonly mongoMeasurmentsRepository: MongoMeasurementsRepository,
    private readonly measurementsRepository: MeasurementRepository,
    private readonly stationsRepository: StationsRepository,
  ) {}
  async execute(): Promise<void> {
    const BATCH_SIZE = 1000
    const rawMeasurements =
      await this.mongoMeasurmentsRepository.findUnprocessed(BATCH_SIZE)

    if (rawMeasurements.length === 0) {
      console.log('No raw measurements to process.')
      return
    }
    const measuresToInsert: MeasurementDto[] = []
    const eventDataList: { stationParameterId: string; value: number }[] = []
    const processedIds: string[] = []
    const metadataKeys = ['_id', 'uid', 'uxt', 'receivedAt', 'topic']
    for (const raw of rawMeasurements) {
      const { _id, uid: stationUid, uxt, receivedAt } = raw
      if (!stationUid || !uxt || !receivedAt) {
        console.warn(`Skipping raw measurement with missing required fields: ${_id}`)
        continue
      }
      for (const paramName in raw) {
        if (metadataKeys.includes(paramName)) continue
        const rawValue = raw[paramName]
        if (rawValue === null || rawValue === undefined) {
          console.warn(
            `Skipping parameter ${paramName} with null or undefined value in raw measurement: ${_id}`,
          )
          continue
        }
        const details = await this.stationsRepository.findStationParameterDetails(
          stationUid,
          paramName,
        )
        if (!details) {
          console.warn(
            `No parameter details found for station ${stationUid} and parameter ${paramName}. Skipping.`,
          )
          continue
        }
        const { parameter, stationParameterId, station } = details
        const finalValue = (rawValue * parameter.factor.value) / parameter.offset.value
        measuresToInsert.push({
          stationId: station.id.value,
          parameterId: parameter.id.value,
          stationName: station.name.value,
          parameterName: parameter.name.value,
          unitOfMeasure: parameter.unitOfMeasure.value,
          value: finalValue,
          createdAt: uxt ? new Date(uxt * 1000) : receivedAt,
        })
        processedIds.push(_id)
        eventDataList.push({
          stationParameterId: stationParameterId.value,
          value: finalValue,
        })
      }
      if (measuresToInsert.length > 0) {
        const measurementEntities = measuresToInsert.map((dto) => Measurement.create(dto))
        await this.measurementsRepository.createMany(measurementEntities)
        await this.mongoMeasurmentsRepository.markAsProcessed(processedIds)
        console.log(
          `Processed and transferred ${measuresToInsert.length} measurements from raw data.`,
        )
        for (const eventData of eventDataList) {
          console.log(`Publishing ${eventDataList.length} events...`)
          const event = new MeasurementCreatedEvent({
            measurementValue: eventData.value,
            stationParameterId: eventData.stationParameterId,
          })
          await this.broker.publish(event)
        }
        eventDataList.length = 0
        measuresToInsert.length = 0
        processedIds.length = 0
      }
    }
  }
}
