import { AlarmRuleDto } from "./alarm-rule.dto"
import { MeasurementAggregateDto } from "./measurement-aggregate.dto"
import { ParameterAggregateDto } from "./parameter-aggregate.dto"

export type AlarmDto = {
    id: string
    message: string
    measurement: MeasurementAggregateDto
    parameter: ParameterAggregateDto,
    rule: AlarmRuleDto
    level: string
    isActive: boolean
    createdAt: Date
    updatedAt?: Date
}