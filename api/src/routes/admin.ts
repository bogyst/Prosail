import type { FastifyInstance } from 'fastify'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../db.js'
import { requireAuth, session } from '../auth.js'
import { currentPeriod, quotaFilter } from '../lib/period.js'

const createSchool = z.object({
  name: z.string().min(2, 'Nazwa szkoły: min. 2 znaki'),
  contactEmail: z.string().email('Podaj poprawny e-mail kontaktowy'),
  contactPhone: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  monthlyQuota: z.coerce.number().int().min(0).max(10_000).default(20),
  accessDays: z.coerce.number().int().min(1).max(365).default(14),
  /// Dane konta, którym szkoła będzie się logować.
  ownerEmail: z.string().email('Podaj poprawny e-mail logowania szkoły'),
  ownerPassword: z.string().min(8, 'Hasło szkoły: min. 8 znaków'),
  ownerName: z.string().optional(),
})

const updateSchool = z.object({
  name: z.string().min(2).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  monthlyQuota: z.coerce.number().int().min(0).max(10_000).optional(),
  accessDays: z.coerce.number().int().min(1).max(365).optional(),
  isActive: z.boolean().optional(),
})

async function audit(actorId: string, action: string, targetId?: string, meta?: unknown) {
  await prisma.auditLog.create({
    data: {
      actorId,
      action,
      targetId,
      meta: meta === undefined ? null : JSON.stringify(meta),
    },
  })
}

export default async function adminRoutes(app: FastifyInstance) {
  app.addHook('preHandler', requireAuth('ADMIN'))

  /** Lista szkół z zużyciem limitu w bieżącym miesiącu. */
  app.get('/schools', async (req) => {
    const period = ((req.query as { period?: string }).period ?? currentPeriod()).slice(0, 7)

    const schools = await prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { email: true, lastLoginAt: true, isActive: true } } },
    })

    // Zużycie liczone jednym zapytaniem grupującym, nie N+1.
    const grouped = await prisma.enrollment.groupBy({
      by: ['schoolId'],
      where: {
        period,
        OR: [{ revokedAt: null }, { activatedAt: { not: null } }],
      },
      _count: { _all: true },
    })
    const usedBy = new Map(grouped.map((g) => [g.schoolId, g._count._all]))

    const now = new Date()
    const activeGrouped = await prisma.enrollment.groupBy({
      by: ['schoolId'],
      where: { revokedAt: null, expiresAt: { gt: now } },
      _count: { _all: true },
    })
    const activeBy = new Map(activeGrouped.map((g) => [g.schoolId, g._count._all]))

    return {
      period,
      schools: schools.map((s) => {
        const used = usedBy.get(s.id) ?? 0
        return {
          id: s.id,
          name: s.name,
          city: s.city,
          contactEmail: s.contactEmail,
          contactPhone: s.contactPhone,
          notes: s.notes,
          isActive: s.isActive,
          accessDays: s.accessDays,
          loginEmail: s.owner.email,
          lastLoginAt: s.owner.lastLoginAt,
          quota: { period, quota: s.monthlyQuota, used, remaining: Math.max(0, s.monthlyQuota - used) },
          activeStudents: activeBy.get(s.id) ?? 0,
          createdAt: s.createdAt,
        }
      }),
    }
  })

  /** Dodanie szkoły razem z jej kontem logowania. */
  app.post('/schools', async (req, reply) => {
    const parsed = createSchool.safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.issues[0].message })
    const d = parsed.data

    const email = d.ownerEmail.toLowerCase()
    if (await prisma.user.findUnique({ where: { email } })) {
      return reply.code(409).send({ error: 'Konto z tym e-mailem już istnieje' })
    }

    const school = await prisma.$transaction(async (tx) => {
      const owner = await tx.user.create({
        data: {
          role: 'SCHOOL',
          name: d.ownerName ?? d.name,
          email,
          passwordHash: await bcrypt.hash(d.ownerPassword, 12),
        },
      })
      return tx.school.create({
        data: {
          name: d.name,
          contactEmail: d.contactEmail,
          contactPhone: d.contactPhone,
          city: d.city,
          notes: d.notes,
          monthlyQuota: d.monthlyQuota,
          accessDays: d.accessDays,
          ownerId: owner.id,
        },
      })
    })

    await audit(session(req).sub, 'school.create', school.id, {
      name: school.name,
      monthlyQuota: school.monthlyQuota,
    })
    return reply.code(201).send({ school })
  })

  /** Zmiana ustawień szkoły — w tym miesięcznego limitu kont. */
  app.patch('/schools/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = updateSchool.safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.issues[0].message })

    const existing = await prisma.school.findUnique({ where: { id } })
    if (!existing) return reply.code(404).send({ error: 'Nie znaleziono szkoły' })

    const school = await prisma.school.update({ where: { id }, data: parsed.data })

    // Blokada szkoły blokuje też jej konto logowania.
    if (parsed.data.isActive !== undefined) {
      await prisma.user.update({
        where: { id: school.ownerId },
        data: { isActive: parsed.data.isActive },
      })
    }

    await audit(session(req).sub, 'school.update', id, parsed.data)
    return { school }
  })

  /** Reset hasła konta szkoły (admin nadaje nowe). */
  app.post('/schools/:id/password', async (req, reply) => {
    const { id } = req.params as { id: string }
    const parsed = z.object({ password: z.string().min(8, 'Hasło: min. 8 znaków') }).safeParse(req.body)
    if (!parsed.success) return reply.code(400).send({ error: parsed.error.issues[0].message })

    const school = await prisma.school.findUnique({ where: { id } })
    if (!school) return reply.code(404).send({ error: 'Nie znaleziono szkoły' })

    await prisma.user.update({
      where: { id: school.ownerId },
      data: { passwordHash: await bcrypt.hash(parsed.data.password, 12) },
    })
    await audit(session(req).sub, 'school.password_reset', id)
    return { ok: true }
  })

  /** Kursanci danej szkoły — podgląd administratora. */
  app.get('/schools/:id/students', async (req, reply) => {
    const { id } = req.params as { id: string }
    const school = await prisma.school.findUnique({ where: { id } })
    if (!school) return reply.code(404).send({ error: 'Nie znaleziono szkoły' })

    const enrollments = await prisma.enrollment.findMany({
      where: { schoolId: id },
      orderBy: { createdAt: 'desc' },
      include: { student: { select: { name: true, email: true, lastLoginAt: true } } },
      take: 500,
    })
    return { students: enrollments }
  })

  /** Trwałe usunięcie szkoły wraz z kursantami (używać ostrożnie). */
  app.delete('/schools/:id', async (req, reply) => {
    const { id } = req.params as { id: string }
    const school = await prisma.school.findUnique({ where: { id } })
    if (!school) return reply.code(404).send({ error: 'Nie znaleziono szkoły' })

    const confirm = (req.query as { confirm?: string }).confirm
    if (confirm !== 'true') {
      return reply.code(400).send({
        error: 'Usunięcie jest nieodwracalne — powtórz z ?confirm=true (lub użyj isActive=false)',
      })
    }

    // Kursanci są powiązani przez User -> Enrollment (cascade), więc usuwamy ich konta.
    const students = await prisma.enrollment.findMany({
      where: { schoolId: id },
      select: { studentId: true },
    })
    await prisma.$transaction([
      prisma.user.deleteMany({ where: { id: { in: students.map((s) => s.studentId) } } }),
      prisma.school.delete({ where: { id } }),
      prisma.user.delete({ where: { id: school.ownerId } }),
    ])
    await audit(session(req).sub, 'school.delete', id, { name: school.name })
    return { ok: true }
  })

  /** Podsumowanie dla panelu administratora. */
  app.get('/stats', async () => {
    const period = currentPeriod()
    const now = new Date()
    const [schools, activeSchools, studentsThisPeriod, activeAccess, quotaSum] = await Promise.all([
      prisma.school.count(),
      prisma.school.count({ where: { isActive: true } }),
      prisma.enrollment.count({ where: { period } }),
      prisma.enrollment.count({ where: { revokedAt: null, expiresAt: { gt: now } } }),
      prisma.school.aggregate({ _sum: { monthlyQuota: true }, where: { isActive: true } }),
    ])
    return {
      period,
      schools,
      activeSchools,
      studentsThisPeriod,
      activeAccess,
      totalQuota: quotaSum._sum.monthlyQuota ?? 0,
    }
  })

  /** Historia zmian (kto co zmienił). */
  app.get('/audit', async (req) => {
    const limit = Math.min(Number((req.query as { limit?: string }).limit ?? 100), 500)
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { actor: { select: { name: true, email: true, role: true } } },
    })
    return { logs }
  })

  /** Zużycie limitów w wybranym miesiącu — do rozliczeń ze szkołami. */
  app.get('/usage', async (req) => {
    const period = ((req.query as { period?: string }).period ?? currentPeriod()).slice(0, 7)
    const schools = await prisma.school.findMany({ orderBy: { name: 'asc' } })
    const rows = await Promise.all(
      schools.map(async (s) => ({
        schoolId: s.id,
        name: s.name,
        quota: s.monthlyQuota,
        used: await prisma.enrollment.count({ where: quotaFilter(s.id, period) }),
      })),
    )
    return { period, rows }
  })
}
