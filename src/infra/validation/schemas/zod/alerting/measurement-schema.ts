import z from "zod";
import { bigIntSchema, numberSchema, stringSchema } from "../global";

export const measurementSchema = z.object({
    entity: z.object({
        value: numberSchema,
        stationuuid: stringSchema,
    }).optional()
})