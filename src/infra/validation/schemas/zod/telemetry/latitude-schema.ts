import { numberSchema } from "@/infra/validation/schemas/zod/global";

export const latitudeSchema = integerSchema.min(-90).max(90);
export const latitudeSchema = numberSchema.min(-90).max(90);

