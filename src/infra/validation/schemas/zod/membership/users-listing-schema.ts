import z from 'zod'

import { booleanSchema, plusIntegerSchema, stringSchema } from '../global'

export const cursorListingSchema = z.object({
  isActive: booleanSchema.optional().default(true),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
})
