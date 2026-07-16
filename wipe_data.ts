import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Wiping tables in order...')
  
  await prisma.documentRequest.deleteMany()
  // Try deleting hearings, then blotters
  try { await (prisma as any).hearing.deleteMany() } catch (e) {}
  try { await prisma.blotter.deleteMany() } catch (e) {}
  
  await prisma.resident.deleteMany()
  await prisma.household.deleteMany()
  
  console.log('Successfully wiped Resident data.')
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
