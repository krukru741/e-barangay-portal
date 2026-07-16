import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { toggleAnnouncementPin, deleteAnnouncement } from 'src/server/services/announcement.service'
import { UserRole } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const userRole = (session.user as any).role as UserRole
  const id = req.query.id as string

  if (!id) return res.status(400).json({ error: 'Announcement ID is required' })

  try {
    if (req.method === 'PATCH') {
      const { isPinned } = req.body
      if (typeof isPinned !== 'boolean') return res.status(400).json({ error: 'isPinned boolean is required' })
      const updated = await toggleAnnouncementPin(id, isPinned, userRole)
      return res.status(200).json(updated)
    }

    if (req.method === 'DELETE') {
      await deleteAnnouncement(id, userRole)
      return res.status(204).end()
    }

    res.setHeader('Allow', ['PATCH', 'DELETE'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('API Error:', error)
    if (error.message && error.message.includes('FORBIDDEN')) {
      return res.status(403).json({ error: error.message })
    }
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
