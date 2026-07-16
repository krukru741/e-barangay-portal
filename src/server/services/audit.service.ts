import { prisma } from 'src/lib/db'

type AuditLogInput = {
  userId: string
  action: string
  entity: string
  entityId: string
  details?: any
}

export const logAudit = async (data: AuditLogInput) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details || {},
      }
    })
  } catch (err) {
    console.error('Failed to write audit log:', err)
  }
}

export const getAuditLogs = async () => {
  return await prisma.auditLog.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 100 // limit to last 100 to prevent large payloads
  })
}
