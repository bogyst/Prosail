import type { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { prisma } from '../db.js'
import { requireAuth, session } from '../auth.js'
import { generateAccessCode } from '../lib/codes.js'
import {
  accessExpiry,
  currentPeriod,
  daysLeft,
  isAccessActive,
  quotaFilter,
  quotaStatus,
} from '../lib/period.js'

const createStudent = z.object({
  name: z.string().min(2, 'Imię i nazwisko kursanta: min. 2 znaki'),
  email: z.string().email('Podaj poprawny e-mail').optional().or(z.literal('')),
  /// Opcjonalnie: krótsza ważność niż domyślna dla szkoły.
  days: z.coerce.number().int().min(1).max(365).optional(),
})

const createBatch = z.object({
  count: z.coerce.number().int().min(1).max(50),
  prefix: z.string().max(40).optional(),
})

/** Zwraca szkołę zalogowanego konta (albo błąd 403). */
async function ownSchool(userId: string) {
  const school = await prisma.school.findUnique({ where: { ownerId: userId } })
  return school
}

export default async function schoolRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth('SCHOOL'))

  /** Dane szkoły + stan puli na bieżący miesiąc. */
  app.get('/me', async (req, reply) => {
    const school = await ownSchool(session(req).sub)
    if (!school) return reply.code(404).send({ error: 'Konto nie ma przypisanej szkoły' })

    const now = new Date()
    const [quota, activeStudents, totalStudents] = await Promise.all([
      quotaStatus(school.id, school.monthlyQuota),
      prisma.enrollment.count({
        where: { schoolId: school.id, revokedAt: null, expiresAt: { gt: now } },
      }),
      prisma.enrollment.count({ where: { schoolId: school.id } }),
    ])

    return {
      school: {
        id: school.id,
        name: school.name,
        city: school.city,
        contactEmail: school.contactEmail,
        contactPhone: school.contactPhone,
        accessDays: school.accessDays,
        isActive: school.isActive,
      },
      quota,
      activeStudents,
      totalStudents,
    }
  })

  /** Lista kursantów szkoły z filtrem statusu. */
  app.get('/students', async (req, reply) => {
    const school = await ownSchool(session(req).sub)
    if (!school) return reply.code(404).send({ error: 'Konto nie ma przypisanej szkoły' })

    const q = req.query as { status?: string; period?: string }
    const now = new Date()
    const where: Prisma.EnrollmentWhereInput = { schoolId: school.id }

    if (q.status === 'active') Object.assign(where, { revokedAt: null, expiresAt: { gt: now } })
    if (q.status === 'expired') Object.assign(where, { revokedAt: null, expiresAt: { lte: now } })
    if (q.status === 'revoked') Object.assign(where, { revokedAt: { not: null } })
    if (q.status === 'unused') Object.assign(where, { activatedAt: null, revokedAt: null })
    if (q.period) where.period = q.period.slice(0, 7)

    const enrollments = await prisma.enrollment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { student: { select: { name: true, email: true, lastLoginAt: true } } },
      take: 500,
    })

    return {
      students: enrollments.map((e) => ({
        enrollmentId: e.id,
        name: e.student.name,
        email: e.student.email,
        accessCode: e.accessCode,
        period: e.period,
        startsAt: e.startsAt,
        expiresAt: e.expiresAt,
        activatedAt: e.activatedAt,
        revokedAt: e.revokedAt,
        lastLoginAt: e.student.lastLoginAt,
        status: e.revokedAt
          ? 'revoked'
          : isAccessActive(e)
            ? e.activatedAt
              ? 'active'
              : 'unused'
            : 'expired',
        daysLeft: isAccessActive(e) ? daysLeft(e.expiresAt) : 0,
      })),
    }
  })

  /**
   * Utworzenie dostępu dla kursanta.
   * Sprawdza limit szkoły na bieżący miesiąc — po jego wyczerpaniu zwraca 409.
   */
  app.post('/students', async (req, reply) => {
    const school = await ownSchool(session(req).sub)
    if (!school) return reply.code(404).send({ error: 'Konto nie ma przypisanej szkoły' })
    if (!school.isActive) return reply.code(403).send({ error: 'Współpraca ze szkołą jest wstrzymana' })

    const parsed = createStudent.safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.issues[0].message })
    const { name, days } = parsed.data
    const email = parsed.data.email && parsed.data.email !== '' ? parsed.data.email.toLowerCase() : null

    if (email && (await prisma.user.findUnique({ where: { email } }))) {
      return reply.code(409).send({ error: 'Konto z tym e-mailem już istnieje' })
    }

    const period = currentPeriod()

    // Limit sprawdzamy wewnątrz transakcji, aby dwa równoległe żądania nie przekroczyły puli.
    try {
      const result = await prisma.$transaction(async (tx) => {
        const used = await tx.enrollment.count({ where: quotaFilter(school.id, period) })
        if (used >= school.monthlyQuota) {
          throw new QuotaExceeded(school.monthlyQuota, used, period)
        }
        const student = await tx.user.create({
          data: { role: 'STUDENT', name, email },
        })
        return tx.enrollment.create({
          data: {
            schoolId: school.id,
            studentId: student.id,
            accessCode: generateAccessCode(),
            period,
            expiresAt: accessExpiry(days ?? school.accessDays),
          },
          include: { student: { select: { name: true, email: true } } },
        })
      })

      const quota = await quotaStatus(school.id, school.monthlyQuota, period)
      return reply.code(201).send({
        student: {
          enrollmentId: result.id,
          name: result.student.name,
          email: result.student.email,
          accessCode: result.accessCode,
          expiresAt: result.expiresAt,
          daysLeft: daysLeft(result.expiresAt),
        },
        quota,
      })
    } catch (err) {
      if (err instanceof QuotaExceeded) {
        return reply.code(409).send({
          error: `Wyczerpano limit kont na ${err.period} (${err.used}/${err.quota}). Skontaktuj się z administratorem, aby go zwiększyć.`,
          quota: { period: err.period, quota: err.quota, used: err.used, remaining: 0 },
        })
      }
      throw err
    }
  })

  /** Wygenerowanie wielu kodów naraz (np. dla całej grupy kursu). */
  app.post('/students/batch', async (req, reply) => {
    const school = await ownSchool(session(req).sub)
    if (!school) return reply.code(404).send({ error: 'Konto nie ma przypisanej szkoły' })
    if (!school.isActive) return reply.code(403).send({ error: 'Współpraca ze szkołą jest wstrzymana' })

    const parsed = createBatch.safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.issues[0].message })
    const { count } = parsed.data
    const prefix = parsed.data.prefix?.trim() || 'Kursant'
    const period = currentPeriod()

    try {
      const created = await prisma.$transaction(async (tx) => {
        const used = await tx.enrollment.count({ where: quotaFilter(school.id, period) })
        if (used + count > school.monthlyQuota) {
          throw new QuotaExceeded(school.monthlyQuota, used, period, count)
        }
        const out = []
        for (let i = 1; i <= count; i++) {
          const student = await tx.user.create({
            data: { role: 'STUDENT', name: `${prefix} ${used + i}` },
          })
          out.push(
            await tx.enrollment.create({
              data: {
                schoolId: school.id,
                studentId: student.id,
                accessCode: generateAccessCode(),
                period,
                expiresAt: accessExpiry(school.accessDays),
              },
              include: { student: { select: { name: true } } },
            }),
          )
        }
        return out
      })

      const quota = await quotaStatus(school.id, school.monthlyQuota, period)
      return reply.code(201).send({
        students: created.map((e) => ({
          enrollmentId: e.id,
          name: e.student.name,
          accessCode: e.accessCode,
          expiresAt: e.expiresAt,
        })),
        quota,
      })
    } catch (err) {
      if (err instanceof QuotaExceeded) {
        return reply.code(409).send({
          error: `Nie można wydać ${err.requested ?? 1} kodów — w puli na ${err.period} zostało ${Math.max(
            0,
            err.quota - err.used,
          )} z ${err.quota}.`,
          quota: { period: err.period, quota: err.quota, used: err.used, remaining: Math.max(0, err.quota - err.used) },
        })
      }
      throw err
    }
  })

  /** Zmiana danych kursanta (np. literówka w nazwisku). */
  app.patch('/students/:id', async (req, reply) => {
    const school = await ownSchool(session(req).sub)
    if (!school) return reply.code(404).send({ error: 'Konto nie ma przypisanej szkoły' })
    const { id } = req.params as { id: string }

    const parsed = z
      .object({ name: z.string().min(2).optional(), email: z.string().email().nullable().optional() })
      .safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.issues[0].message })

    const e = await prisma.enrollment.findUnique({ where: { id } })
    if (!e || e.schoolId !== school.id) {
      return reply.code(404).send({ error: 'Nie znaleziono kursanta w tej szkole' })
    }
    await prisma.user.update({ where: { id: e.studentId }, data: parsed.data })
    return { ok: true }
  })

  /** Wycofanie dostępu. Nieużyty kod wraca do puli miesiąca. */
  app.post('/students/:id/revoke', async (req, reply) => {
    const school = await ownSchool(session(req).sub)
    if (!school) return reply.code(404).send({ error: 'Konto nie ma przypisanej szkoły' })
    const { id } = req.params as { id: string }

    const e = await prisma.enrollment.findUnique({ where: { id } })
    if (!e || e.schoolId !== school.id) {
      return reply.code(404).send({ error: 'Nie znaleziono kursanta w tej szkole' })
    }
    if (e.revokedAt) return reply.code(409).send({ error: 'Ten dostęp jest już wycofany' })

    await prisma.enrollment.update({ where: { id }, data: { revokedAt: new Date() } })
    const quota = await quotaStatus(school.id, school.monthlyQuota)
    return {
      ok: true,
      slotReturned: e.activatedAt === null,
      quota,
    }
  })

  /** Ponowne wydanie dostępu wygasłemu kursantowi — zużywa nowy slot z puli. */
  app.post('/students/:id/renew', async (req, reply) => {
    const school = await ownSchool(session(req).sub)
    if (!school) return reply.code(404).send({ error: 'Konto nie ma przypisanej szkoły' })
    const { id } = req.params as { id: string }
    const period = currentPeriod()

    const e = await prisma.enrollment.findUnique({ where: { id } })
    if (!e || e.schoolId !== school.id) {
      return reply.code(404).send({ error: 'Nie znaleziono kursanta w tej szkole' })
    }

    try {
      const updated = await prisma.$transaction(async (tx) => {
        const used = await tx.enrollment.count({ where: quotaFilter(school.id, period) })
        // Jeśli ten dostęp już jest liczony w bieżącym okresie, nie liczymy go podwójnie.
        const alreadyCounted = e.period === period && (e.revokedAt === null || e.activatedAt !== null)
        if (!alreadyCounted && used >= school.monthlyQuota) {
          throw new QuotaExceeded(school.monthlyQuota, used, period)
        }
        return tx.enrollment.update({
          where: { id },
          data: {
            period,
            startsAt: new Date(),
            expiresAt: accessExpiry(school.accessDays),
            revokedAt: null,
            accessCode: generateAccessCode(),
            activatedAt: null,
          },
        })
      })
      const quota = await quotaStatus(school.id, school.monthlyQuota, period)
      return { student: { enrollmentId: updated.id, accessCode: updated.accessCode, expiresAt: updated.expiresAt }, quota }
    } catch (err) {
      if (err instanceof QuotaExceeded) {
        return reply.code(409).send({
          error: `Wyczerpano limit kont na ${err.period} (${err.used}/${err.quota}).`,
          quota: { period: err.period, quota: err.quota, used: err.used, remaining: 0 },
        })
      }
      throw err
    }
  })
}

class QuotaExceeded extends Error {
  constructor(
    public quota: number,
    public used: number,
    public period: string,
    public requested?: number,
  ) {
    super('quota exceeded')
  }
}
