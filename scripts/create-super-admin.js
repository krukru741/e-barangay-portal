const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = 'superadmin@ebarangay.ph'
  const password = 'Superadmin123'
  const hashedPassword = await bcrypt.hash(password, 10)

  // Check if it exists
  let superadmin = await prisma.user.findUnique({ where: { email } })

  if (superadmin) {
    // Update password if it already exists to be sure
    superadmin = await prisma.user.update({
      where: { email },
      data: {
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
        name: 'Super Admin'
      }
    })
    console.log('Super Admin account already existed. Password and role reset.')
  } else {
    // Create new
    superadmin = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email,
        passwordHash: hashedPassword,
        role: 'SUPER_ADMIN',
      }
    })
    console.log('Super Admin account successfully created!')
  }

  console.log(`
  ------------------------------------
  SUPER ADMIN CREDENTIALS
  Email:    ${email}
  Password: ${password}
  ------------------------------------
  `)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
