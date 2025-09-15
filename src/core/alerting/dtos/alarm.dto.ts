import { ParameterAggregate } from "../aggregate/parameter-aggregate"

export type AlarmDto = {
    id: string
    message: string
    parameter: ParameterAggregate
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}