import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { fetchAllUsers, updateUserRole } from 'src/server/services/admin.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const role = (session.user as any)?.role

  // Manage Users requires ADMIN or SUPER_ADMIN
  if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
    return res.status(403).json({ error: 'Forbidden. Admin access required.' })
  }

  if (req.method === 'GET') {
    try {
      const users = await fetchAllUsers()
      return res.status(200).json(users)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { targetUserId, newRole } = req.body
      if (!targetUserId || !newRole) {
        return res.status(400).json({ error: 'Missing required fields' })
      }
      
      const updated = await updateUserRole(targetUserId, newRole, (session.user as any).id)
      return res.status(200).json(updated)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  res.setHeader('Allow', ['GET', 'PUT'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
