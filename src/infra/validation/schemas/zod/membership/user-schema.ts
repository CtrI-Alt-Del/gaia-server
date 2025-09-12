import z from 'zod'

import { booleanSchema, stringSchema } from '@/infra/validation/schemas/zod/global'

export const userSchema = z.object({
  name: stringSchema,
  email: stringSchema,
  role: z.enum(['owner', 'member']),
  isActive: booleanSchema.optional(),
})
