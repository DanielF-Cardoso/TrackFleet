import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const password = 'admin123'
  const hashedPassword = await bcrypt.hash(password, 8)

  await prisma.manager.create({
    data: {
      firstName: 'Acesso',
      lastName: 'Admin',
      email: 'admin@admin.com',
      phone: '001111111111',
      street: 'Rua 1',
      number: 1,
      district: 'Bairro 1',
      city: 'Cidade 1',
      state: 'SP',
      zipCode: '00000-000',
      lastLogin: new Date(),
      password: hashedPassword,
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log(`📧 Email: admin@admin.com`)
  console.log(`🔑 Password: ${password}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
