import { Measurement } from "@/core/telemetry/domain/entities/measurement";
import { PrismaMeasure } from "../types/prisma-measure";
import { MeasurementDto } from "@/core/telemetry/domain/dtos/measurement-dto";
import type Prisma from '@prisma/client'

export class PrismaMeasurementMapper{
    static toEntity(measurement: PrismaMeasure): Measurement {
        return Measurement.create(PrismaMeasurementMapper.toDto(measurement))
    }

    static toPrisma(measurement: Measurement): Prisma.Measure{
        return{
            id: measurement.id.value,
            value: measurement.value.value,
            unit_of_measure: measurement.unitOfMeasure.value,
            createdAt: measurement.createdAt.value,
            stationParameterId: measurement.stationParameter.id?.value as string
        }
    }

    static toDto(measurement: PrismaMeasure): MeasurementDto{
        return {
            id: measurement.id,
            value: measurement.value,
            unitOfMeasure: measurement.unit_of_measure,
            createdAt: measurement.createdAt ? measurement.createdAt as Date : new Date(),
            stationParameter: {
                id: measurement.stationParameter.id,
                parameter: {
                    id: measurement.stationParameter.parameter.id ,
                    name: measurement.stationParameter.parameter.name
                },
                station: {
                    id: measurement.stationParameter.station.id,
                    name: measurement.stationParameter.station.name
                }
            }
        }
    }
}