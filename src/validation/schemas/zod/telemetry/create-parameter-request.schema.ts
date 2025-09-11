import { integerSchema, stringSchema } from '@/validation/schemas/zod/global'
import z from 'zod'

export const createParameterRequestSchema = z.object({
  name: stringSchema,
  unitOfMeasure: stringSchema,
  numberOfDecimalPlaces: integerSchema.min(0).max(10),
  factor: integerSchema.min(0),
  offset: integerSchema,
})
