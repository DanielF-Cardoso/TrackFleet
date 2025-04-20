import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string(),
  FALLBACK_LANGUAGE: z.string().optional().default('en'),
  JWT_SECRET: z.string(),
})

export type Env = z.infer<typeof envSchema>
