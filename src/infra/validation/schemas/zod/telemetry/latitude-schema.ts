import { integerSchema } from "@/infra/validation/schemas/zod/global";

export const latitudeSchema = integerSchema.min(-90).max(90);
