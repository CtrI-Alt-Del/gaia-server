import z from "zod";
import { booleanSchema, stringSchema } from "../global";
import { measurementSchema } from "./measurement-schema";
import { alarmRuleSchema } from "./alarm-rule-schema";

export const alarmSchema = z.object({
    message: stringSchema,
    measurement: measurementSchema,
    rule: alarmRuleSchema,
    level: stringSchema,
    isActive: booleanSchema
})