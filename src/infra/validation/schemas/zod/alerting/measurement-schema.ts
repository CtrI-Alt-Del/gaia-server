import z from "zod";
import { numberSchema, stringSchema } from "../global";

export const measurementSchema = z.object({
    entity: z.object({
        value: numberSchema,
        stationuuid: stringSchema,
        parameterId: stringSchema
    }).optional()
})