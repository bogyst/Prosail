/**
 * Tworzy pierwsze konto administratora (idempotentnie).
 *
 *   ADMIN_EMAIL=ty@example.com ADMIN_PASSWORD=... npm run seed
 */
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const email = process.env.ADMIN_EMAIL?.toLowerCase()
const password = process.env.ADMIN_PASSWORD
const name = process.env.ADMIN_NAME ?? 'Administrator'

if (!email || !password) {
  console.error('Ustaw ADMIN_EMAIL i ADMIN_PASSWORD (min. 8 znaków) przed uruchomieniem seeda.')
  process.exit(1)
}
if (password.length < 8) {
  console.error('ADMIN_PASSWORD musi mieć min. 8 znaków.')
  process.exit(1)
}

const passwordHash = await bcrypt.hash(password, 12)
const admin = await prisma.user.upsert({
  where: { email },
  update: { passwordHash, role: 'ADMIN', isActive: true, name },
  create: { email, passwordHash, role: 'ADMIN', name },
})

console.log(`✔ Administrator gotowy: ${admin.email} (id: ${admin.id})`)
await prisma.$disconnect()
