import { ParameterDto } from "@/core/telemetry/domain/dtos/parameter-dto"
import { StationDto } from "@/core/telemetry/domain/dtos/station-dto"

export type MeasurementDto = {
  id?: string
  stationParameter: {
    id?: string,
    station: {
      id: string,
      name: string
    },
    parameter: {
      id: string,
      name: string
    }
  }
  unitOfMeasure: string
  value: number
  createdAt: Date
}
