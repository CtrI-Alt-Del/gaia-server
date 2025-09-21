import { stringSchema } from '@/infra/validation/schemas/zod/global'
import { latitudeSchema } from '@/infra/validation/schemas/zod/telemetry/latitude-schema'
import { longitudeSchema } from '@/infra/validation/schemas/zod/telemetry/longitude-schema'
import z from 'zod'

export const updateStationSchema = z.object({
  name: stringSchema.optional(),
  uid: stringSchema.optional(),
  latitude: latitudeSchema.optional(),
  address: stringSchema.optional(),
  longitude: longitudeSchema.optional(),
  parameters: z.array(stringSchema).optional(),
})
