import { stringSchema } from '@/infra/validation/schemas/zod/global'
import { latitudeSchema } from '@/infra/validation/schemas/zod/telemetry/latitude-schema'
import { longitudeSchema } from '@/infra/validation/schemas/zod/telemetry/longitude-schema'
import z from 'zod'

export const createStationSchema = z.object({
  name: stringSchema,
  UID: stringSchema,
  latitude: latitudeSchema,
  address: stringSchema,
  longitude: longitudeSchema,
  parameterIds: z.array(stringSchema).min(1),
})
