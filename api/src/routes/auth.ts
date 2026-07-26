import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../db.js'
import { env } from '../env.js'
import {
  clearSessionCookie,
  requireAuth,
  session,
  setSessionCookie,
  type SessionPayload,
} from '../auth.js'
import { normalizeCode } from '../lib/codes.js'
import { daysLeft, isAccessActive, quotaStatus } from '../lib/period.js'

const loginBody = z.object({
  email: z.string().email('Podaj poprawny adres e-mail'),
  password: z.string().min(1, 'Podaj hasło'),
})

const accessBody = z.object({
  code: z.string().min(4, 'Podaj kod dostępu'),
})

export default async function authRoutes(app: FastifyInstance) {
  /** Logowanie administratora i szkoły (e-mail + hasło). */
  app.post(
    '/login',
    { config: { rateLimit: { max: 10, timeWindow: '5 minutes' } } },
    async (req, reply) => {
      const parsed = loginBody.safeParse(req.body)
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues[0].message })
      }
      const { email, password } = parsed.data

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { school: { select: { id: true, isActive: true } } },
      })

      // Ta sama odpowiedź dla złego e-maila i złego hasła (nie zdradzamy, co jest nie tak).
      const invalid = { error: 'Nieprawidłowy e-mail lub hasło' }
      if (!user || !user.passwordHash) return reply.code(401).send(invalid)
      if (!(await bcrypt.compare(password, user.passwordHash))) {
        return reply.code(401).send(invalid)
      }
      if (!user.isActive) {
        return reply.code(403).send({ error: 'Konto jest nieaktywne — skontaktuj się z administratorem' })
      }
      if (user.role === 'SCHOOL' && user.school && !user.school.isActive) {
        return reply.code(403).send({ error: 'Współpraca ze szkołą jest wstrzymana' })
      }

      const payload: SessionPayload = {
        sub: user.id,
        role: user.role,
        schoolId: user.school?.id,
      }
      const token = app.jwt.sign(payload, { expiresIn: env.SESSION_TTL })
      setSessionCookie(reply, token)
      await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

      return { user: { id: user.id, name: user.name, role: user.role, email: user.email } }
    },
  )

  /** Logowanie kursanta kodem dostępu (bez hasła). */
  app.post(
    '/access',
    { config: { rateLimit: { max: 20, timeWindow: '5 minutes' } } },
    async (req, reply) => {
      const parsed = accessBody.safeParse(req.body)
      if (!parsed.success) {
        return reply.code(400).send({ error: parsed.error.issues[0].message })
      }
      const code = normalizeCode(parsed.data.code)

      const enrollment = await prisma.enrollment.findUnique({
        where: { accessCode: code },
        include: {
          student: true,
          school: { select: { id: true, name: true, isActive: true } },
        },
      })
      if (!enrollment) {
        return reply.code(401).send({ error: 'Nie znaleziono takiego kodu dostępu' })
      }
      if (enrollment.revokedAt) {
        return reply.code(403).send({ error: 'Ten kod został wycofany przez szkołę' })
      }
      if (!isAccessActive(enrollment)) {
        return reply.code(403).send({
          error: 'Dostęp wygasł',
          expiredAt: enrollment.expiresAt,
        })
      }
      if (!enrollment.school.isActive) {
        return reply.code(403).send({ error: 'Współpraca ze szkołą jest wstrzymana' })
      }

      // Pierwsze użycie kodu = aktywacja (od tej pory slot jest bezpowrotnie zużyty).
      if (!enrollment.activatedAt) {
        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: { activatedAt: new Date() },
        })
      }
      await prisma.user.update({
        where: { id: enrollment.studentId },
        data: { lastLoginAt: new Date() },
      })

      const payload: SessionPayload = {
        sub: enrollment.studentId,
        role: 'STUDENT',
        schoolId: enrollment.schoolId,
      }
      const token = app.jwt.sign(payload, { expiresIn: env.SESSION_TTL })
      setSessionCookie(reply, token)

      return {
        user: { id: enrollment.studentId, name: enrollment.student.name, role: 'STUDENT' },
        access: {
          expiresAt: enrollment.expiresAt,
          daysLeft: daysLeft(enrollment.expiresAt),
          schoolName: enrollment.school.name,
        },
      }
    },
  )

  app.post('/logout', async (_req, reply) => {
    clearSessionCookie(reply)
    return { ok: true }
  })

  /** Kim jestem + stan dostępu/limitu (frontend woła to przy starcie). */
  app.get('/me', { preHandler: requireAuth() }, async (req, reply) => {
    const s = session(req)
    const user = await prisma.user.findUnique({
      where: { id: s.sub },
      include: {
        school: true,
        enrollment: { include: { school: { select: { name: true } } } },
      },
    })
    if (!user || !user.isActive) {
      clearSessionCookie(reply)
      return reply.code(401).send({ error: 'Konto nie jest już aktywne' })
    }

    if (user.role === 'STUDENT') {
      const e = user.enrollment
      if (!e || !isAccessActive(e)) {
        clearSessionCookie(reply)
        return reply.code(403).send({ error: 'Dostęp wygasł', expiredAt: e?.expiresAt })
      }
      return {
        user: { id: user.id, name: user.name, role: user.role },
        access: {
          expiresAt: e.expiresAt,
          daysLeft: daysLeft(e.expiresAt),
          schoolName: e.school.name,
        },
      }
    }

    if (user.role === 'SCHOOL' && user.school) {
      const q = await quotaStatus(user.school.id, user.school.monthlyQuota)
      return {
        user: { id: user.id, name: user.name, role: user.role, email: user.email },
        school: {
          id: user.school.id,
          name: user.school.name,
          accessDays: user.school.accessDays,
          isActive: user.school.isActive,
        },
        quota: q,
      }
    }

    return { user: { id: user.id, name: user.name, role: user.role, email: user.email } }
  })

  /** Zmiana własnego hasła (admin i szkoła). */
  app.post('/password', { preHandler: requireAuth('ADMIN', 'SCHOOL') }, async (req, reply) => {
    const body = z
      .object({ current: z.string().min(1), next: z.string().min(8, 'Nowe hasło: min. 8 znaków') })
      .safeParse(req.body)
    if (!body.success) return reply.code(400).send({ error: body.error.issues[0].message })

    const s = session(req)
    const user = await prisma.user.findUnique({ where: { id: s.sub } })
    if (!user?.passwordHash) return reply.code(400).send({ error: 'Konto bez hasła' })
    if (!(await bcrypt.compare(body.data.current, user.passwordHash))) {
      return reply.code(401).send({ error: 'Obecne hasło jest nieprawidłowe' })
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await bcrypt.hash(body.data.next, 12) },
    })
    return { ok: true }
  })
}
