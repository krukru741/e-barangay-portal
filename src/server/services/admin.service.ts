import { prisma } from 'src/lib/db'
import { logAudit } from './audit.service'
import { UserRole } from '@prisma/client'

export const fetchAllUsers = async () => {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

export const updateUserRole = async (targetUserId: string, newRole: UserRole, adminId: string) => {
  const updated = await prisma.user.update({
    where: { id: targetUserId },
    data: { role: newRole }
  })
  
  await logAudit({
    userId: adminId,
    action: 'UPDATE_ROLE',
    entity: 'USER',
    entityId: targetUserId,
    details: { newRole }
  })
  
  return updated
}
