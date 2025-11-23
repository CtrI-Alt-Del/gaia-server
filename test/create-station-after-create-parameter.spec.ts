import { Id } from '@/core/global/domain/structures'
import { ParametersRepository, StationsRepository } from '@/core/global/interfaces'
import { Parameter } from '@/core/telemetry/domain/entities/parameter'
import { Station } from '@/core/telemetry/domain/entities/station'
import { CreateParameterUseCase, CreateStationUseCase } from '@/core/telemetry/use-cases'
import {describe, beforeEach, it, expect} from 'vitest'
import { mock, MockProxy } from 'vitest-mock-extended'
vi.mock('@/core/telemetry/domain/entities/station')
vi.mock('@/core/telemetry/domain/entities/parameter')

describe("CreateStationAfterCreateParameter", () => {
    let stationsRepository: MockProxy<StationsRepository>
    let parametersRepository: MockProxy<ParametersRepository>
    let createStationUseCase: CreateStationUseCase
    let createParameterUseCase: CreateParameterUseCase

    beforeEach(() => {
        stationsRepository = mock<StationsRepository>()
        parametersRepository = mock<ParametersRepository>()
        createStationUseCase = new CreateStationUseCase(stationsRepository, parametersRepository)
        createParameterUseCase = new CreateParameterUseCase(parametersRepository)
    })

    it("It should create a station with a newly created parameter", async() => {
        const mockStation = {dto: {id: 'station-test-123'}} as Station
        const mockParameter = {dto: {id: 'parameter-test-321'}} as Parameter

        const createParameterRequest = {
            name: "test-wind-speed",
            code: "987654321",
            unitOfMeasure: "m/s",
            factor: 0.01,
            offset: 2,
        }

        const createStationRequest = {
            name: 'Station Test',
            uid: 'STATION-001-002',
            address: '123 Test St',
            latitude: -23.1791,
            longitude: -45.8872,
        }

        vi.mocked(Parameter.create).mockResolvedValue(mockParameter)
        parametersRepository.add.mockResolvedValue()

        const resultCreateParameter = await createParameterUseCase.execute(createParameterRequest)
        const createdParameterId = [resultCreateParameter.id as string] 

        vi.mocked(Station.create).mockResolvedValue(mockStation)
        stationsRepository.add.mockResolvedValue()

        const resultCreateStation = await createStationUseCase.execute({
            stationDto: createStationRequest,
            parameterIds: createdParameterId,
        })

        expect(parametersRepository.findManyByIds).toHaveBeenCalledWith(
            [Id.create(resultCreateParameter.id)],
        )
        expect(Parameter.create).toHaveBeenCalledWith({
            name: resultCreateParameter.name,
            code: resultCreateParameter.code,
            unitOfMeasure: resultCreateParameter.unitOfMeasure,
            factor: resultCreateParameter.factor,
            offset: resultCreateParameter.offset,
        })
        expect(Station.create).toHaveBeenCalledWith({
            name: createStationRequest.name,
            uid: createStationRequest.uid,
            address: createStationRequest.address,
            latitude: createStationRequest.latitude,
            longitude: createStationRequest.longitude,
            quantityOfParameters: 1,
            lastReadAt: null,
        })
        expect(stationsRepository.add).toHaveBeenCalledWith(mockStation, [Id.create(resultCreateParameter.id)])
        expect(parametersRepository.add).toHaveBeenCalledWith(mockParameter)
        expect(resultCreateStation).toEqual(mockStation.dto)
        expect(resultCreateParameter).toEqual(mockParameter.dto)
    })
})