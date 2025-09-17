import { ParameterDto } from "@/core/telemetry/domain/dtos/parameter-dto"

export type StationDto = {
  id?: string
  name: string
  UID: string
  latitude: number
  address:string
  longitude: number
  parameters: ParameterDto[]
  lastReadAt?: Date
  isActive?: boolean
  createdAt?: Date
  updatedAt?: Date
}
