import z from 'zod'
import { booleanSchema, stringSchema } from '../global'
import { alarmRuleSchema } from './alarm-rule-schema'
import { parameterSchema } from './parameter-schema'

export const alarmSchema = z.object({
  message: stringSchema,
  rule: alarmRuleSchema,
  level: stringSchema,
  isActive: booleanSchema,
  parameter: parameterSchema,
})
