import z from 'zod'

import { plusIntegerSchema, statusSchema, stringSchema } from '../global'

export const usersListingSchema = z.object({
  status: statusSchema.optional().default('all'),
  nextCursor: stringSchema.optional(),
  previousCursor: stringSchema.optional(),
  pageSize: plusIntegerSchema.optional().default(20),
})
