import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().optional().default(3333),
  DATABASE_URL: z.string(),
  FALLBACK_LANGUAGE: z.string().optional().default('en'),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  LOG_PREFIX: z.string().optional().default('TrackFleet'),
  LOG_LEVEL: z
    .enum(['debug', 'info', 'warn', 'error', 'verbose'])
    .optional()
    .default('info'),
  LOG_MAX_SIZE: z.string().optional().default('20m'),
  LOG_MAX_FILES: z.string().optional().default('14d'),
})

export type Env = z.infer<typeof envSchema>
