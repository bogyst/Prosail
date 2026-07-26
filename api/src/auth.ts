import type { FastifyReply, FastifyRequest } from 'fastify'
import type { Role } from '@prisma/client'
import { env } from './env.js'

export const SESSION_COOKIE = 'prosail_session'

export interface SessionPayload {
  sub: string // id użytkownika
  role: Role
  /// Id szkoły — dla konta SCHOOL (jej własna szkoła) i STUDENT (szkoła macierzysta).
  schoolId?: string
}

export function setSessionCookie(reply: FastifyReply, token: string) {
  reply.setCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.COOKIE_SECURE,
    path: '/',
    maxAge: 60 * 60 * 12,
  })
}

export function clearSessionCookie(reply: FastifyReply) {
  reply.clearCookie(SESSION_COOKIE, { path: '/' })
}

/** Wymaga zalogowania; opcjonalnie konkretnej roli (lub jednej z listy). */
export function requireAuth(...roles: Role[]) {
  return async function guard(req: FastifyRequest, reply: FastifyReply) {
    try {
      await req.jwtVerify()
    } catch {
      return reply.code(401).send({ error: 'Nie jesteś zalogowany' })
    }
    const user = req.user as SessionPayload
    if (roles.length && !roles.includes(user.role)) {
      return reply.code(403).send({ error: 'Brak uprawnień do tego zasobu' })
    }
  }
}

export function session(req: FastifyRequest): SessionPayload {
  return req.user as SessionPayload
}
