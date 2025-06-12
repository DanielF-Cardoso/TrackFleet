import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().url(),
  VITE_ENV: z.enum(['development', 'production', 'test']),
});

const envVars = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_ENV: import.meta.env.VITE_ENV,
};

const parsed = envSchema.safeParse(envVars);

if (!parsed.success) {
  console.error('Variáveis de ambiente inválidas:', parsed.error.format());
  throw new Error('Falha na validação das variáveis de ambiente');
}

export const env = parsed.data;