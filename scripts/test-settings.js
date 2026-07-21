const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    let settings = await prisma.systemSettings.findFirst()
    if (!settings) {
      console.log('No settings found. Creating one...')
      settings = await prisma.systemSettings.create({ data: {} })
    }
    console.log('Settings:', settings)
    
    settings = await prisma.systemSettings.update({
      where: { id: settings.id },
      data: { barangayName: 'Test Update' }
    })
    console.log('Update success:', settings)
  } catch (err) {
    console.error('Error:', err)
  }
}

main().finally(() => prisma.$disconnect())
