import { AlarmRuleDto } from "./alarm-rule.dto"
import { MeasurementAggregateDto } from "./measurement-aggregate.dto"

export type AlarmDto = {
    id?: string
    message: string
    measurement: MeasurementAggregateDto
    rule: AlarmRuleDto
    level: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
}