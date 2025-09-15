import z from 'zod'

import {
  booleanSchema,
  emailSchema,
  stringSchema,
} from '@/infra/validation/schemas/zod/global'

export const userSchema = z.object({
  name: stringSchema,
  email: emailSchema,
  role: z.enum(['owner', 'member']).optional().default('member'),
  isActive: booleanSchema.optional(),
})
