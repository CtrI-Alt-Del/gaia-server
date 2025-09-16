import { ParameterDto } from "@/core/telemetry/domain/dtos/parameter-dto"
import { StationDto } from "@/core/telemetry/domain/dtos/station-dto"

export type MeasurementDto = {
  id: string
  station: StationDto
  parameter: ParameterDto
  value: number
  measuredAt: Date
}
