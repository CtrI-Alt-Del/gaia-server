import { AlertRuleDto } from "./alertrule.dto"
import { ParameterAggregateDto } from "./parameteraggregate.dto"

export type AlarmDto = {
    id: string
    message: string
    parameter: ParameterAggregateDto
    rule: AlertRuleDto
    level: string
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}