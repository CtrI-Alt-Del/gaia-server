import { z } from 'zod'

export const envSchema = z.object({
  POSTGRES_URL: z.url(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  PORT: z.coerce.number().default(3333),
  MODE: z.enum(['dev', 'prod', 'staging']),
  LOG_LEVEL: z.enum(['info', 'debug']),
})

export type Env = z.infer<typeof envSchema>
