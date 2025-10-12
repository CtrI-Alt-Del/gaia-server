import { Measurement } from "@/core/telemetry/domain/entities/measurement";
import { PrismaMeasure } from "../types/prisma-measure";
import { MeasurementDto } from "@/core/telemetry/domain/dtos/measurement-dto";

export class PrismaMeasurementMapper{
    static toEntity(measurement: PrismaMeasure): Measurement {
        return Measurement.create(PrismaMeasurementMapper.toDto(measurement))
    }

    static toPrisma(measurement: Measurement): PrismaMeasure{
        return{
            id: measurement.id.value,
            value: measurement.value.value,
            unit_of_measure: measurement.unitOfMeasure.value,
            createdAt: measurement.createdAt.value,
            stationParameter: {
                connect: {
                    id: undefined,
                    stationId: measurement.stationParameter.stationId.value,
                    parameterId: measurement.stationParameter.parameterId.value
                }
            }
        }
    }

    static toDto(measurement: PrismaMeasure): MeasurementDto{
        const parameter = measurement.stationParameter.connect?.parameter
        const station = measurement.stationParameter.connect?.station

        return {
            id: measurement.id,
            value: measurement.value,
            unitOfMeasure: measurement.unit_of_measure,
            createdAt: measurement.createdAt ? measurement.createdAt as Date : new Date(),
            stationParameter: {
                parameterId: parameter?.id as string,
                stationId: station?.id as string
            }
        }
    }
}