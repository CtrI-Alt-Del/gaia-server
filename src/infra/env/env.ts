import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.url(),
	PORT: z.coerce.number().default(3333),
	ENV: z.enum(["dev", "prod", "stating"]),
});

export type Env = z.infer<typeof envSchema>;
