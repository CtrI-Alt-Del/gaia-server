import {
  booleanSchema,
  integerSchema,
  stringSchema,
} from '@/infra/validation/schemas/zod/global'
import z from 'zod'

export const parameterSchema = z.object({
  name: stringSchema,
  unitOfMeasure: stringSchema,
  numberOfDecimalPlaces: integerSchema.min(0).max(10),
  factor: integerSchema.min(0),
  isActive: booleanSchema.optional(),
  offset: integerSchema,
})
