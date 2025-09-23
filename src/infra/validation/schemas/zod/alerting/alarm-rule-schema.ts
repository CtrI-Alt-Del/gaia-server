import z from "zod";
import { numberSchema, stringSchema } from "../global";

export const alarmRuleSchema = z.object({
    threshold: numberSchema,
    operation: stringSchema
})