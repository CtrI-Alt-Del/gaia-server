import { ParameterDto } from "@/core/telemetry/dtos/parameter.dto"

export type StationDto = {
  id: string
  name: string
  UID: string
  latitude: number
  longitude: number
  lastReadAt: Date
  parameters: ParameterDto[]
}
