import { prisma } from 'src/lib/db'
import { AnnouncementInput } from 'src/lib/validations/announcement.schema'

export async function findAllAnnouncements() {
  return await prisma.announcement.findMany({
    orderBy: [
      { isPinned: 'desc' },
      { publishedAt: 'desc' }
    ]
  })
}

export async function createAnnouncementRecord(data: AnnouncementInput) {
  return await prisma.announcement.create({
    data: {
      title: data.title,
      body: data.body,
      type: data.type as any,
      isPinned: data.isPinned,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    }
  })
}

export async function updateAnnouncementPin(id: string, isPinned: boolean) {
  return await prisma.announcement.update({
    where: { id },
    data: { isPinned }
  })
}

export async function deleteAnnouncementRecord(id: string) {
  return await prisma.announcement.delete({
    where: { id }
  })
}
