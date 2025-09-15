import { ParameterDto } from "@/core/telemetry/dtos/parameter-dto"

export type ParameterAggregateDto = {
    id: string
    parameter: ParameterDto
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}