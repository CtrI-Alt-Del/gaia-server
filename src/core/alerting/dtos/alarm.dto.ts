import { ParameterAggregate } from "../aggregate/parameter-aggregate"

export type AlarmDto = {
    id: string
    name: string
    parameter: ParameterAggregate
    isActive: boolean
    createdAt: Date
}