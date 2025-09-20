import z from "zod";
import { numberSchema, stringSchema } from "../global";

export const measurementSchema = z.object({
    value: numberSchema,
    stationuuid: stringSchema,
})