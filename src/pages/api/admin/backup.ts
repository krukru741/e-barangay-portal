import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from 'src/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
    }

    // Parse included modules from query string (e.g., ?include=residents,documents,finance)
    const includeQuery = req.query.include as string
    // If no include param is provided, default to all modules (for backward compatibility)
    const modules = includeQuery ? includeQuery.split(',') : ['residents', 'documents', 'blotters', 'officials', 'announcements', 'finance', 'users']

    // Fetch data conditionally
    const [residents, households, users, documents, blotters, hearings, officials, announcements, budgets, expenditures] = await Promise.all([
      modules.includes('residents') ? prisma.resident.findMany({ include: { household: true } }) : Promise.resolve([]),
      modules.includes('residents') ? prisma.household.findMany() : Promise.resolve([]),
      modules.includes('users') || !includeQuery ? prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true } }) : Promise.resolve([]),
      modules.includes('documents') ? prisma.documentRequest.findMany() : Promise.resolve([]),
      modules.includes('blotters') ? prisma.blotter.findMany({ include: { hearings: true } }) : Promise.resolve([]),
      modules.includes('blotters') ? prisma.hearing.findMany() : Promise.resolve([]),
      modules.includes('officials') ? prisma.official.findMany() : Promise.resolve([]),
      modules.includes('announcements') ? prisma.announcement.findMany() : Promise.resolve([]),
      modules.includes('finance') ? prisma.budget.findMany() : Promise.resolve([]),
      modules.includes('finance') ? prisma.expenditure.findMany() : Promise.resolve([]),
    ])

    const backup = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: {
        ...(modules.includes('residents') && { residents, households }),
        ...(modules.includes('users') && { users }),
        ...(modules.includes('documents') && { documents }),
        ...(modules.includes('blotters') && { blotters, hearings }),
        ...(modules.includes('officials') && { officials }),
        ...(modules.includes('announcements') && { announcements }),
        ...(modules.includes('finance') && { budgets, expenditures }),
      }
    }

    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="ebarangay-backup-${new Date().toISOString().split('T')[0]}.json"`)
    return res.status(200).json(backup)
  } catch (error: any) {
    console.error('Backup API Error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
