
import { numberSchema } from '@/infra/validation/schemas/zod/global'

export const longitudeSchema = numberSchema.min(-180).max(180)

