import { z } from 'zod'

export const envSchema = z.object({
  GAIA_PANEL_URL: z.url(),
  POSTGRES_URL: z.url(),
  POSTGRES_DATABASE: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  PORT: z.coerce.number().default(3333),
  MODE: z.enum(['dev', 'prod', 'staging']),
  LOG_LEVEL: z.enum(['info', 'debug']),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
})

export type Env = z.infer<typeof envSchema>
