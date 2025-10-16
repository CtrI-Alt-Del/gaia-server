import { Measurement } from "@/core/telemetry/domain/entities/measurement";
import { PrismaMeasure } from "../types/prisma-measure";
import { MeasurementDto } from "@/core/telemetry/domain/dtos/measurement-dto";
import { PrismaParameterMapper } from "./prisma-parameter-mapper";
import { PrismaStationMapper } from "./prisma-station-mapper";
import { Text } from "@/core/global/domain/structures";

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
            stationParameterId: (measurement.stationParameter.id as Text).value,
            stationParameter: {
                id: (measurement.stationParameter.id as Text).value,
                parameterId: measurement.stationParameter.parameterId.value,
                stationId: measurement.stationParameter.stationId.value
            }
        }
    }

    static toDto(measurement: PrismaMeasure): MeasurementDto{

        return {
            id: measurement.id,
            value: measurement.value,
            unitOfMeasure: measurement.unit_of_measure,
            createdAt: measurement.createdAt ? measurement.createdAt as Date : new Date(),
            stationParameter: {
                id: measurement.stationParameterId,
                parameterId: measurement.stationParameter.parameterId,
                stationId: measurement.stationParameter.stationId
            }
        }
    }
}