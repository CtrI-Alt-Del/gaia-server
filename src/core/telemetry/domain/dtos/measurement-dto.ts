import { ParameterDto } from "@/core/telemetry/domain/dtos/parameter-dto"
import { StationDto } from "@/core/telemetry/domain/dtos/station-dto"

export type MeasurementDto = {
  id: string
  stationParameter: {
    station: StationDto
    parameter: ParameterDto
  }
  unitOfMeasure: string
  value: number
  createdAt: Date
}
