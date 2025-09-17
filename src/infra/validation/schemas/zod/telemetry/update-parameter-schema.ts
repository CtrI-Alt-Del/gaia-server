import { numberSchema, stringSchema } from '@/infra/validation/schemas/zod/global'
import z from 'zod'

export const updateParameterSchema = z.object({
  name: stringSchema.optional(),
  unitOfMeasure: stringSchema.optional(),
  factor: numberSchema.min(0).optional(),
  offset: numberSchema.optional(),
})
