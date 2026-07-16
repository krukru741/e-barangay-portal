import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'
import { getAuditLogs } from 'src/server/services/audit.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const role = (session.user as any)?.role

  // System Settings & Audit Logs requires SUPER_ADMIN ONLY
  if (role !== 'SUPER_ADMIN') {
    return res.status(403).json({ error: 'Forbidden. Super Admin access required.' })
  }

  if (req.method === 'GET') {
    try {
      const logs = await getAuditLogs()
      return res.status(200).json(logs)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
