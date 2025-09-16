import { ParameterDto } from "@/core/telemetry/domain/dtos/parameter-dto"

export type StationDto = {
  id: string
  name: string
  UID: string
  latitude: number
  longitude: number
  lastReadAt: Date
  parameters: ParameterDto[]
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}
