import { AlarmRuleDto } from "./alarm-rule.dto"
import { ParameterAggregateDto } from "./parameteraggregate.dto"

export type AlarmDto = {
    id: string
    message: string
    parameter: ParameterAggregateDto
    rule: AlarmRuleDto
    level: string
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}