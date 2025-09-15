import { ParameterAggregateDto } from "./parameteraggregate.dto"

export type AlarmDto = {
    id: string
    message: string
    parameter: ParameterAggregateDto
    rule: {threshold: bigint, operation: string}
    level: string
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}