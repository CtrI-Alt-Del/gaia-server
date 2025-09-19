import {
  booleanSchema,
  numberSchema,
  stringSchema,
} from '@/infra/validation/schemas/zod/global'
import z from 'zod'

export const parameterSchema = z.object({
  name: stringSchema,
  unitOfMeasure: stringSchema,
  factor: numberSchema.min(0),
  isActive: booleanSchema.optional(),
  offset: numberSchema,
})
