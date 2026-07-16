import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { getAnnouncements, createAnnouncement } from 'src/server/services/announcement.service'
import { announcementSchema } from 'src/lib/validations/announcement.schema'
import { UserRole } from '@prisma/client'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Allow public/resident read access for announcements
      const announcements = await getAnnouncements()
      return res.status(200).json(announcements)
    }

    // Protect POST route
    const session = await getServerSession(req, res, authOptions)
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const userRole = (session.user as any).role as UserRole

    if (req.method === 'POST') {
      const validatedData = announcementSchema.parse(req.body)
      const newAnnouncement = await createAnnouncement(validatedData, userRole)
      return res.status(201).json(newAnnouncement)
    }

    res.setHeader('Allow', ['GET', 'POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('API Error:', error)
    if (error.message && error.message.includes('FORBIDDEN')) {
      return res.status(403).json({ error: error.message })
    }
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
