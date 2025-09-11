import { MeasurementDto } from "@/core/telemetry/dtos/measurement.dto"

export type AlarmDto = {
    id: string
    name: string
    measure: MeasurementDto
}