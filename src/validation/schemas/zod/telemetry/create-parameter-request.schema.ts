import z from "zod";

export const createParameterRequestSchema = z.object({
  name: z.string().min(1),
  unitOfMeasure: z.string().min(1),
  numberOfDecimalPlaces: z.number().min(0).max(10),
  factor: z.number().min(0),
  offset: z.number(),
})
