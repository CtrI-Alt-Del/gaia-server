import { Parameter } from "@/core/telemetry/entities/parameter"
import { Station } from "@/core/telemetry/entities/station"

export type ParameterAggregate = {
    id: string,
    station: Station,
    parameter: Parameter
}