import { z } from 'zod'

export const statusSchema = z.enum(['all', 'active', 'inactive'])
