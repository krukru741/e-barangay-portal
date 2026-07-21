const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Fields in SystemSettings model:')
  console.log(Object.keys(prisma.systemSettings.fields || {}))
  // If fields is not available, we can try to get the DMMF
  const dmmf = require('@prisma/client').Prisma.dmmf
  const model = dmmf.datamodel.models.find(m => m.name === 'SystemSettings')
  console.log('DMMF Fields:', model ? model.fields.map(f => f.name) : 'Model not found')
}
main().finally(() => prisma.$disconnect())
