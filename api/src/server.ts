import Fastify from 'fastify'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import cors from '@fastify/cors'
import rateLimit from '@fastify/rate-limit'
import { env } from './env.js'
import { prisma } from './db.js'
import { SESSION_COOKIE } from './auth.js'
import authRoutes from './routes/auth.js'
import adminRoutes from './routes/admin.js'
import schoolRoutes from './routes/school.js'

export async function buildServer() {
  const app = Fastify({
    logger:
      env.NODE_ENV === 'production'
        ? { level: 'info' }
        : { level: 'warn', transport: undefined },
    trustProxy: true,
  })

  await app.register(cookie)
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: { cookieName: SESSION_COOKIE, signed: false },
  })
  await app.register(rateLimit, { global: false, max: 300, timeWindow: '1 minute' })

  if (env.CORS_ORIGIN) {
    await app.register(cors, { origin: env.CORS_ORIGIN.split(','), credentials: true })
  }

  app.get('/api/health', async () => {
    await prisma.$queryRaw`SELECT 1`
    return { ok: true, ts: new Date().toISOString() }
  })

  await app.register(authRoutes, { prefix: '/api/auth' })
  await app.register(adminRoutes, { prefix: '/api/admin' })
  await app.register(schoolRoutes, { prefix: '/api/school' })

  app.setNotFoundHandler((_req, reply) => reply.code(404).send({ error: 'Nie znaleziono zasobu' }))

  app.setErrorHandler((err, req, reply) => {
    req.log.error({ err }, 'Nieobsłużony błąd')
    const code = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500
    reply.code(code).send({
      error: code === 500 ? 'Błąd serwera — spróbuj ponownie' : err.message,
    })
  })

  return app
}

// Uruchamiaj serwer tylko przy bezpośrednim wywołaniu (nie w testach).
const isMain = process.argv[1]?.includes('server')
if (isMain) {
  const app = await buildServer()
  try {
    await app.listen({ port: env.PORT, host: env.HOST })
    app.log.info(`API ProSail nasłuchuje na ${env.HOST}:${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }

  for (const sig of ['SIGINT', 'SIGTERM'] as const) {
    process.on(sig, async () => {
      await app.close()
      await prisma.$disconnect()
      process.exit(0)
    })
  }
}
