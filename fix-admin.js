const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  let user = await prisma.user.findUnique({
    where: { email: 'admin@ebarangay.ph' }
  })
  
  if (user) {
    console.log(`User found: ${user.email} with role: ${user.role}`)
    if (user.role !== 'ADMIN') {
      console.log('Updating role to ADMIN...')
      user = await prisma.user.update({
        where: { email: 'admin@ebarangay.ph' },
        data: { role: 'ADMIN' }
      })
      console.log(`Role updated successfully to ${user.role}`)
    } else {
      console.log('User is already an ADMIN.')
    }
  } else {
    console.log('User admin@ebarangay.ph NOT FOUND in the database.')
    // Let's see what users are in the DB
    const allUsers = await prisma.user.findMany()
    console.log('Other users:', allUsers.map(u => `${u.email} (${u.role})`))
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
