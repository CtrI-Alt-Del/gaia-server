import z from "zod";
import { bigIntSchema, numberSchema, stringSchema } from "../global";

export const alarmRuleSchema = z.object({
    threshold: bigIntSchema,
    operation: stringSchema
})