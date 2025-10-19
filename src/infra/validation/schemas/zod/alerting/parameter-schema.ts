import z from 'zod'
import { stringSchema } from '../global'

export const parameterSchema = z.object({
  id: stringSchema.optional(),
  entity: z
    .object({
      name: stringSchema,
      unitOfMeasure: stringSchema,
      stationName: stringSchema,
    })
    .optional(),
})
