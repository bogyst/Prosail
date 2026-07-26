import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL jest wymagany'),
  /// Sekret do podpisywania tokenów sesji (min. 32 znaki).
  JWT_SECRET: z.string().min(32, 'JWT_SECRET musi mieć min. 32 znaki'),
  /// Czas życia sesji (np. "12h", "7d").
  SESSION_TTL: z.string().default('12h'),
  /// Adres frontendu — do CORS w trybie dev (w produkcji ten sam origin przez nginx).
  CORS_ORIGIN: z.string().optional(),
  /// Ciasteczko tylko po HTTPS (w produkcji: true).
  COOKIE_SECURE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  /// Dane pierwszego administratora tworzonego przez `npm run seed`.
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  ADMIN_NAME: z.string().default('Administrator'),
})

export const env = schema.parse(process.env)
export type Env = typeof env
