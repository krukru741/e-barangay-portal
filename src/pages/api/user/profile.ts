import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from 'src/lib/db'
import bcrypt from 'bcryptjs'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req, res, authOptions)
    if (!session) return res.status(401).json({ error: 'Unauthorized' })

    const userId = (session.user as any).id

    if (req.method === 'GET') {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, role: true, image: true, isActive: true }
      })
      return res.status(200).json(user)
    }

    if (req.method === 'PUT') {
      const { name, email, image } = req.body
      if (!name || !email) return res.status(400).json({ error: 'Name and email are required' })

      // Check if email is taken by another user
      const existing = await prisma.user.findFirst({ where: { email, NOT: { id: userId } } })
      if (existing) return res.status(400).json({ error: 'Email is already in use by another account.' })

      const updated = await prisma.user.update({
        where: { id: userId },
        data: { name, email, image },
        select: { id: true, name: true, email: true, role: true, image: true }
      })
      return res.status(200).json(updated)
    }

    if (req.method === 'PATCH') {
      // Change password
      const { currentPassword, newPassword } = req.body
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' })
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' })
      }

      const user = await prisma.user.findUnique({ where: { id: userId } })
      if (!user?.hashedPassword) {
        return res.status(400).json({ error: 'Cannot change password for this account type' })
      }

      const isValid = await bcrypt.compare(currentPassword, user.hashedPassword)
      if (!isValid) return res.status(400).json({ error: 'Current password is incorrect' })

      const hashed = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({ where: { id: userId }, data: { hashedPassword: hashed } })
      return res.status(200).json({ message: 'Password changed successfully' })
    }

    res.setHeader('Allow', ['GET', 'PUT', 'PATCH'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('Profile API Error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
