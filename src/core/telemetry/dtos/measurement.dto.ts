import { ParameterDto } from "@/core/telemetry/dtos/parameter.dto"
import { StationDto } from "@/core/telemetry/dtos/station.dto"

export type MeasurementDto = {
  id: string
  station: StationDto
  parameter: ParameterDto
  value: number
  measuredAt: Date
}
