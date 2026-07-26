import { prisma } from '../db.js'

/** Okres rozliczeniowy w formacie YYYY-MM (limity szkół liczone są miesięcznie). */
export function currentPeriod(now = new Date()): string {
  const y = now.getUTCFullYear()
  const m = String(now.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

/** Data wygaśnięcia dostępu: teraz + `days` dni. */
export function accessExpiry(days: number, from = new Date()): Date {
  const d = new Date(from)
  d.setUTCDate(d.getUTCDate() + days)
  return d
}

/**
 * Zużycie limitu w danym okresie.
 *
 * Zasada: liczymy każdy wydany dostęp z tego miesiąca, ale slot WRACA do puli,
 * jeśli szkoła wycofała kod, którego kursant nigdy nie użył (pomyłka przy
 * wpisywaniu danych nie kosztuje szkoły miejsca).
 */
export function quotaFilter(schoolId: string, period: string) {
  return {
    schoolId,
    period,
    OR: [{ revokedAt: null }, { activatedAt: { not: null } }],
  }
}

export async function usedInPeriod(schoolId: string, period = currentPeriod()): Promise<number> {
  return prisma.enrollment.count({ where: quotaFilter(schoolId, period) })
}

export interface QuotaStatus {
  period: string
  quota: number
  used: number
  remaining: number
}

export async function quotaStatus(
  schoolId: string,
  quota: number,
  period = currentPeriod(),
): Promise<QuotaStatus> {
  const used = await usedInPeriod(schoolId, period)
  return { period, quota, used, remaining: Math.max(0, quota - used) }
}

/** Czy dostęp kursanta jest w tej chwili aktywny. */
export function isAccessActive(e: {
  expiresAt: Date
  revokedAt: Date | null
}, now = new Date()): boolean {
  return e.revokedAt === null && e.expiresAt.getTime() > now.getTime()
}

export function daysLeft(expiresAt: Date, now = new Date()): number {
  return Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / 86_400_000))
}
