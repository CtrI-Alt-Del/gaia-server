import z from "zod";
import { stringSchema } from "../global";
import { alarmRuleSchema } from "./alarm-rule-schema";

export const updateAlarmSchema = z.object({
    message: stringSchema.optional(),
    rule: alarmRuleSchema.optional(),
    level: stringSchema.optional(),
})