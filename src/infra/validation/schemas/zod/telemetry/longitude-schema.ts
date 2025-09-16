import { integerSchema } from "@/infra/validation/schemas/zod/global";

export const longitudeSchema = integerSchema.min(-180).max(180)
