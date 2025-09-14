import z from 'zod'

import { booleanSchema, plusIntegerSchema, stringSchema } from '../global'

export const usersListingSchema = z.object({
  isActive: booleanSchema.optional().default(false),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(1),
})
