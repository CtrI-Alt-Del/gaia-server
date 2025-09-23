import z from "zod";
import { bigIntSchema, stringSchema } from "../global";

export const alarmRuleSchema = z.object({
    threshold: bigIntSchema,
    operation: stringSchema
})