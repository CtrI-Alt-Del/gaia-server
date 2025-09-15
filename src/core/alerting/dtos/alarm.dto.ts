import { ParameterAggregate } from "../aggregate/parameter-aggregate"
import { ParameterAggregateDto } from "./parameteraggregate.dto"

export type AlarmDto = {
    id: string
    message: string
    parameter: ParameterAggregateDto
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}