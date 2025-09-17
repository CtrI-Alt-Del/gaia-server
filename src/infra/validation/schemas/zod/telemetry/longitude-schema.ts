import { integerSchema } from "@/infra/validation/schemas/zod/global";
import { numberSchema } from '@/infra/validation/schemas/zod/global

export const longitudeSchema = integerSchema.min(-180).max(180)
export const longitudeSchema = numberSchema.min(-180).max(180)
