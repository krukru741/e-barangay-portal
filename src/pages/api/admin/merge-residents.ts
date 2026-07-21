import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from 'src/lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { sourceId, targetId } = req.body

  if (!sourceId || !targetId) {
    return res.status(400).json({ error: 'Both Source ID and Target ID are required' })
  }

  if (sourceId === targetId) {
    return res.status(400).json({ error: 'Source and Target cannot be the same' })
  }

  try {
    const sourceResident = await prisma.resident.findUnique({ where: { id: sourceId } })
    const targetResident = await prisma.resident.findUnique({ where: { id: targetId } })

    if (!sourceResident || !targetResident) {
      return res.status(404).json({ error: 'One or both residents not found' })
    }

    if (sourceResident.isMerged || targetResident.isMerged) {
      return res.status(400).json({ error: 'One or both residents are already merged/archived' })
    }

    // Execute the merge in a transaction
    await prisma.$transaction([
      prisma.documentRequest.updateMany({
        where: { residentId: sourceId },
        data: { residentId: targetId }
      }),
      prisma.blotter.updateMany({
        where: { complainantId: sourceId },
        data: { complainantId: targetId }
      }),
      prisma.blotter.updateMany({
        where: { respondentId: sourceId },
        data: { respondentId: targetId }
      }),
      prisma.official.updateMany({
        where: { residentId: sourceId },
        data: { residentId: targetId }
      }),
      prisma.resident.update({
        where: { id: sourceId },
        data: {
          isMerged: true,
          mergedToId: targetId,
          deletedAt: new Date()
        }
      })
    ])

    return res.status(200).json({ message: 'Residents merged successfully' })
  } catch (error: any) {
    console.error('Merge residents error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
