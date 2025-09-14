import {
  integerSchema,
  stringSchema,
} from '@/infra/validation/schemas/zod/global'
import z from 'zod'

export const updateParameterSchema = z.object({
  name: stringSchema.optional(),
  unitOfMeasure: stringSchema.optional(),
  numberOfDecimalPlaces: integerSchema.min(0).max(10).optional(),
  factor: integerSchema.min(0).optional(),
  offset: integerSchema.optional(),
})
