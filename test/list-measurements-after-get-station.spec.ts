import { Id } from '@/core/global/domain/structures'
import { StationsRepository } from '@/core/global/interfaces'
import { MeasurementFaker } from '@/core/telemetry/domain/entities/fakers/measurement-faker'
import { StationsFaker } from '@/core/telemetry/domain/entities/fakers/station-faker'
import { MeasurementsRepository } from '@/core/telemetry/interfaces'
import { GetStationDetailsUseCase } from '@/core/telemetry/use-cases'
import { ListMeasurementsUseCase } from '@/core/telemetry/use-cases/list-measurements-use-case'
import {describe, beforeEach, it, expect} from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'

describe("ListMeasurementsAfterGetStation", () => {
    let stationsRepository: MockProxy<StationsRepository>
    let measurementsRepository: MockProxy<MeasurementsRepository>
    let getStationDetailsUseCase: GetStationDetailsUseCase
    let listMeasurementUseCase: ListMeasurementsUseCase

    beforeEach(() => {
        stationsRepository = mock<StationsRepository>()
        measurementsRepository = mock<MeasurementsRepository>()
        getStationDetailsUseCase = new GetStationDetailsUseCase(stationsRepository)
        listMeasurementUseCase = new ListMeasurementsUseCase(measurementsRepository)
    })

    it("Should get measurements after get a station", async() => {
        const fakeStation = StationsFaker.fake()
        const fakeMeasurement = MeasurementFaker.fake({
            parameter: {
                entity: {
                    stationId: fakeStation.id.value,
                    stationName: fakeStation.name.value,
                    name: "",
                    unitOfMeasure: ""
                }
            }
        })

        stationsRepository.findById.mockResolvedValue(fakeStation)
        measurementsRepository.findManyMeasurementsByStationId.mockResolvedValue([fakeMeasurement])

        const resultGetStationDetails = await getStationDetailsUseCase.execute({stationId: fakeStation.id.value})
        const resultListMeasurement = await listMeasurementUseCase.execute({pageSize: 20, status: "active", stationId: fakeStation.id.value})

        expect(stationsRepository.findById).toHaveBeenCalledWith(Id.create(fakeStation.id.value))
        expect(measurementsRepository.findManyMeasurementsByStationId).toHaveBeenCalledWith({pageSize: 20, status: "active", stationId: fakeStation.id.value})
    })
})