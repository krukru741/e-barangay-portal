import { prisma } from 'src/lib/db'
import { Prisma } from '@prisma/client'

export const getOfficials = async () => {
  return await prisma.official.findMany({
    include: {
      resident: {
        select: {
          firstName: true,
          middleName: true,
          lastName: true,
          suffix: true,
          photo: true,
        }
      }
    },
    orderBy: {
      termStart: 'desc'
    }
  })
}

export const createOfficial = async (data: Prisma.OfficialUncheckedCreateInput) => {
  return await prisma.official.create({
    data,
    include: {
      resident: true
    }
  })
}

export const getOfficialById = async (id: string) => {
  return await prisma.official.findUnique({
    where: { id },
    include: { resident: true }
  })
}
