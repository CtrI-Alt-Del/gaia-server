import z from "zod";
import { numberSchema, stringSchema } from "../global";

export const parameterSchema = z.object({
    entity: z.object({
        name: stringSchema,
        unitOfMeasure: stringSchema
    }).optional()
})