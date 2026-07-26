/**
 * Test end-to-end całego przepływu: admin → szkoła → kursanci → limity → wygaśnięcie.
 * Uruchamiany na czystej bazie testowej (`npm run test:e2e`).
 */
import bcrypt from 'bcryptjs'
import { buildServer } from '../src/server.js'
import { prisma } from '../src/db.js'
import { accessExpiry, currentPeriod } from '../src/lib/period.js'

let passed = 0
let failed = 0

function check(name: string, cond: boolean, extra?: unknown) {
  if (cond) {
    passed++
    console.log(`  ✔ ${name}`)
  } else {
    failed++
    console.log(`  ✘ ${name}`, extra !== undefined ? JSON.stringify(extra) : '')
  }
}

function cookieFrom(res: { headers: Record<string, unknown> }): string {
  const raw = res.headers['set-cookie']
  const list = Array.isArray(raw) ? raw : [String(raw ?? '')]
  return list.map((c) => c.split(';')[0]).join('; ')
}

// ——— czysta baza ———
await prisma.auditLog.deleteMany()
await prisma.enrollment.deleteMany()
await prisma.school.deleteMany()
await prisma.user.deleteMany()

const app = await buildServer()

console.log('\n1) Health i logowanie administratora')
{
  const h = await app.inject({ method: 'GET', url: '/api/health' })
  check('GET /api/health → 200', h.statusCode === 200, h.body)

  await prisma.user.create({
    data: {
      role: 'ADMIN',
      name: 'Admin Testowy',
      email: 'admin@prosail.test',
      passwordHash: await bcrypt.hash('haslo-admina-123', 12),
    },
  })

  const bad = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: 'admin@prosail.test', password: 'zle-haslo' },
  })
  check('złe hasło → 401', bad.statusCode === 401, bad.body)
}

const login = await app.inject({
  method: 'POST',
  url: '/api/auth/login',
  payload: { email: 'admin@prosail.test', password: 'haslo-admina-123' },
})
check('login admina → 200', login.statusCode === 200, login.body)
const adminCookie = cookieFrom(login)

console.log('\n2) Ochrona tras (role)')
{
  const noAuth = await app.inject({ method: 'GET', url: '/api/admin/schools' })
  check('bez sesji → 401', noAuth.statusCode === 401)

  const asAdminOnSchool = await app.inject({
    method: 'GET',
    url: '/api/school/me',
    headers: { cookie: adminCookie },
  })
  check('admin w panelu szkoły → 403', asAdminOnSchool.statusCode === 403, asAdminOnSchool.body)
}

console.log('\n3) Administrator tworzy szkołę z limitem 3 konta/mies.')
const created = await app.inject({
  method: 'POST',
  url: '/api/admin/schools',
  headers: { cookie: adminCookie },
  payload: {
    name: 'Szkoła Żeglarska Mikołajki',
    contactEmail: 'kontakt@mikolajki.test',
    city: 'Mikołajki',
    monthlyQuota: 3,
    accessDays: 14,
    ownerEmail: 'szkola@mikolajki.test',
    ownerPassword: 'haslo-szkoly-123',
  },
})
check('POST /api/admin/schools → 201', created.statusCode === 201, created.body)
const schoolId = created.json().school.id as string

{
  const dup = await app.inject({
    method: 'POST',
    url: '/api/admin/schools',
    headers: { cookie: adminCookie },
    payload: {
      name: 'Duplikat',
      contactEmail: 'x@y.test',
      monthlyQuota: 1,
      ownerEmail: 'szkola@mikolajki.test',
      ownerPassword: 'haslo-szkoly-123',
    },
  })
  check('ten sam e-mail logowania → 409', dup.statusCode === 409, dup.body)
}

console.log('\n4) Szkoła loguje się i widzi swoją pulę')
const schoolLogin = await app.inject({
  method: 'POST',
  url: '/api/auth/login',
  payload: { email: 'szkola@mikolajki.test', password: 'haslo-szkoly-123' },
})
check('login szkoły → 200', schoolLogin.statusCode === 200, schoolLogin.body)
const schoolCookie = cookieFrom(schoolLogin)

{
  const me = await app.inject({ method: 'GET', url: '/api/school/me', headers: { cookie: schoolCookie } })
  const q = me.json().quota
  check('pula 3, zużyto 0', q.quota === 3 && q.used === 0 && q.remaining === 3, q)
  check('okres = bieżący miesiąc', q.period === currentPeriod(), q)
}

console.log('\n5) Szkoła wydaje dostępy — limit 3 działa')
const codes: string[] = []
for (const name of ['Anna Kowalska', 'Piotr Nowak', 'Ewa Wiśniewska']) {
  const r = await app.inject({
    method: 'POST',
    url: '/api/school/students',
    headers: { cookie: schoolCookie },
    payload: { name },
  })
  if (r.statusCode === 201) codes.push(r.json().student.accessCode)
  check(`kursant „${name}” → 201`, r.statusCode === 201, r.body)
}
{
  const over = await app.inject({
    method: 'POST',
    url: '/api/school/students',
    headers: { cookie: schoolCookie },
    payload: { name: 'Czwarty Kursant' },
  })
  check('czwarty kursant → 409 (limit)', over.statusCode === 409, over.body)
  check('komunikat mówi o limicie', /limit/i.test(over.json().error ?? ''), over.json())

  const me = await app.inject({ method: 'GET', url: '/api/school/me', headers: { cookie: schoolCookie } })
  check('pula wyczerpana (3/3, zostało 0)', me.json().quota.used === 3 && me.json().quota.remaining === 0, me.json().quota)
}

console.log('\n6) Kursant loguje się kodem (i aktywuje dostęp)')
let studentCookie = ''
{
  const bad = await app.inject({ method: 'POST', url: '/api/auth/access', payload: { code: 'SAIL-XXXX-YYYY' } })
  check('nieznany kod → 401', bad.statusCode === 401, bad.body)

  // kod wpisany „niechlujnie” — bez myślników i małymi literami
  const messy = codes[0].replace(/-/g, '').toLowerCase()
  const ok = await app.inject({ method: 'POST', url: '/api/auth/access', payload: { code: messy } })
  check('kod bez myślników/małymi literami → 200', ok.statusCode === 200, ok.body)
  check('zwraca dni dostępu (14)', ok.json().access?.daysLeft === 14, ok.json().access)
  studentCookie = cookieFrom(ok)

  const me = await app.inject({ method: 'GET', url: '/api/auth/me', headers: { cookie: studentCookie } })
  check('GET /api/auth/me kursanta → 200', me.statusCode === 200, me.body)
  check('rola = STUDENT', me.json().user.role === 'STUDENT', me.json().user)

  const forbidden = await app.inject({
    method: 'GET',
    url: '/api/school/students',
    headers: { cookie: studentCookie },
  })
  check('kursant w panelu szkoły → 403', forbidden.statusCode === 403)
}

console.log('\n7) Wycofanie kodu: nieużyty wraca do puli, użyty nie')
{
  const list = await app.inject({ method: 'GET', url: '/api/school/students', headers: { cookie: schoolCookie } })
  const students = list.json().students as Array<{ enrollmentId: string; accessCode: string; status: string }>
  check('lista zwraca 3 kursantów', students.length === 3, students.length)
  check('pierwszy ma status active (po logowaniu)', students.some((s) => s.status === 'active'), students.map((s) => s.status))

  const unused = students.find((s) => s.status === 'unused')!
  const revoke = await app.inject({
    method: 'POST',
    url: `/api/school/students/${unused.enrollmentId}/revoke`,
    headers: { cookie: schoolCookie },
  })
  check('wycofanie nieużytego → 200', revoke.statusCode === 200, revoke.body)
  check('slot wrócił do puli', revoke.json().slotReturned === true && revoke.json().quota.used === 2, revoke.json())

  // teraz jest miejsce na kolejnego kursanta
  const again = await app.inject({
    method: 'POST',
    url: '/api/school/students',
    headers: { cookie: schoolCookie },
    payload: { name: 'Nowy Kursant' },
  })
  check('po zwolnieniu slotu można wydać kod → 201', again.statusCode === 201, again.body)

  // wycofanie aktywnego (użytego) NIE zwraca slotu
  const active = students.find((s) => s.status === 'active')!
  const revoke2 = await app.inject({
    method: 'POST',
    url: `/api/school/students/${active.enrollmentId}/revoke`,
    headers: { cookie: schoolCookie },
  })
  check('wycofanie aktywnego → 200', revoke2.statusCode === 200, revoke2.body)
  check('slot NIE wrócił (użyty)', revoke2.json().slotReturned === false && revoke2.json().quota.used === 3, revoke2.json())

  // wycofany kod nie działa
  const blocked = await app.inject({ method: 'POST', url: '/api/auth/access', payload: { code: active.accessCode } })
  check('logowanie wycofanym kodem → 403', blocked.statusCode === 403, blocked.body)
}

console.log('\n8) Wygaśnięcie po 14 dniach')
{
  const e = await prisma.enrollment.findFirst({ where: { revokedAt: null, activatedAt: null } })
  // przesuwamy datę wygaśnięcia w przeszłość — symulacja upływu czasu
  await prisma.enrollment.update({
    where: { id: e!.id },
    data: { expiresAt: accessExpiry(-1), startsAt: accessExpiry(-15) },
  })
  const expired = await app.inject({ method: 'POST', url: '/api/auth/access', payload: { code: e!.accessCode } })
  check('logowanie wygasłym kodem → 403', expired.statusCode === 403, expired.body)
  check('komunikat: dostęp wygasł', /wygas/i.test(expired.json().error ?? ''), expired.json())

  const list = await app.inject({
    method: 'GET',
    url: '/api/school/students?status=expired',
    headers: { cookie: schoolCookie },
  })
  check('filtr status=expired działa', list.json().students.length === 1, list.json().students.length)
}

console.log('\n9) Administrator zmienia limit i widzi zużycie')
{
  const patch = await app.inject({
    method: 'PATCH',
    url: `/api/admin/schools/${schoolId}`,
    headers: { cookie: adminCookie },
    payload: { monthlyQuota: 10 },
  })
  check('PATCH limitu → 200', patch.statusCode === 200, patch.body)
  check('nowy limit = 10', patch.json().school.monthlyQuota === 10, patch.json().school)

  const me = await app.inject({ method: 'GET', url: '/api/school/me', headers: { cookie: schoolCookie } })
  check('szkoła widzi podniesiony limit', me.json().quota.quota === 10 && me.json().quota.remaining === 7, me.json().quota)

  const list = await app.inject({ method: 'GET', url: '/api/admin/schools', headers: { cookie: adminCookie } })
  const s = list.json().schools[0]
  check('lista admina pokazuje zużycie', s.quota.used === 3 && s.quota.quota === 10, s.quota)
  check('lista admina pokazuje aktywnych kursantów', typeof s.activeStudents === 'number', s.activeStudents)

  const stats = await app.inject({ method: 'GET', url: '/api/admin/stats', headers: { cookie: adminCookie } })
  check('statystyki: 1 szkoła', stats.json().schools === 1, stats.json())

  const audit = await app.inject({ method: 'GET', url: '/api/admin/audit', headers: { cookie: adminCookie } })
  check('audyt zapisał zmiany', audit.json().logs.length >= 2, audit.json().logs.length)
}

console.log('\n10) Blokada szkoły odcina dostęp')
{
  await app.inject({
    method: 'PATCH',
    url: `/api/admin/schools/${schoolId}`,
    headers: { cookie: adminCookie },
    payload: { isActive: false },
  })
  const relogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email: 'szkola@mikolajki.test', password: 'haslo-szkoly-123' },
  })
  check('zablokowana szkoła nie zaloguje się → 403', relogin.statusCode === 403, relogin.body)

  // przywracamy do dalszych testów
  await app.inject({
    method: 'PATCH',
    url: `/api/admin/schools/${schoolId}`,
    headers: { cookie: adminCookie },
    payload: { isActive: true },
  })
}

console.log('\n11) Wydawanie kodów partiami i odnowienie dostępu')
{
  const fresh = cookieFrom(
    await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'szkola@mikolajki.test', password: 'haslo-szkoly-123' },
    }),
  )
  const batch = await app.inject({
    method: 'POST',
    url: '/api/school/students/batch',
    headers: { cookie: fresh },
    payload: { count: 5, prefix: 'Grupa A' },
  })
  check('batch 5 kodów → 201', batch.statusCode === 201, batch.body)
  check('otrzymano 5 kodów', batch.json().students?.length === 5, batch.json().students?.length)
  check('pula: 8/10', batch.json().quota.used === 8, batch.json().quota)

  const tooMany = await app.inject({
    method: 'POST',
    url: '/api/school/students/batch',
    headers: { cookie: fresh },
    payload: { count: 5 },
  })
  check('batch przekraczający pulę → 409', tooMany.statusCode === 409, tooMany.body)

  const expiredOne = await prisma.enrollment.findFirst({ where: { expiresAt: { lt: new Date() } } })
  const renew = await app.inject({
    method: 'POST',
    url: `/api/school/students/${expiredOne!.id}/renew`,
    headers: { cookie: fresh },
  })
  check('odnowienie wygasłego dostępu → 200', renew.statusCode === 200, renew.body)
  check('nowy kod różni się od starego', renew.json().student.accessCode !== expiredOne!.accessCode, renew.json().student)
  const newCode = renew.json().student.accessCode
  const useNew = await app.inject({ method: 'POST', url: '/api/auth/access', payload: { code: newCode } })
  check('odnowiony kod działa → 200', useNew.statusCode === 200, useNew.body)
}

console.log('\n12) Izolacja danych między szkołami')
{
  const other = await app.inject({
    method: 'POST',
    url: '/api/admin/schools',
    headers: { cookie: adminCookie },
    payload: {
      name: 'Szkoła Giżycko',
      contactEmail: 'kontakt@gizycko.test',
      monthlyQuota: 5,
      ownerEmail: 'szkola@gizycko.test',
      ownerPassword: 'haslo-szkoly-456',
    },
  })
  const otherCookie = cookieFrom(
    await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'szkola@gizycko.test', password: 'haslo-szkoly-456' },
    }),
  )
  check('druga szkoła utworzona', other.statusCode === 201, other.body)

  const list = await app.inject({ method: 'GET', url: '/api/school/students', headers: { cookie: otherCookie } })
  check('druga szkoła nie widzi kursantów pierwszej', list.json().students.length === 0, list.json().students.length)

  // próba wycofania kursanta z innej szkoły
  const foreign = await prisma.enrollment.findFirst({ where: { schoolId } })
  const attack = await app.inject({
    method: 'POST',
    url: `/api/school/students/${foreign!.id}/revoke`,
    headers: { cookie: otherCookie },
  })
  check('nie można ruszyć kursanta innej szkoły → 404', attack.statusCode === 404, attack.body)
}

await app.close()
await prisma.$disconnect()

console.log(`\n${'─'.repeat(48)}`)
console.log(`Wynik: ${passed} zaliczonych, ${failed} niezaliczonych`)
process.exit(failed === 0 ? 0 : 1)
