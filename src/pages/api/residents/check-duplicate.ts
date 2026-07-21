import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { prisma } from 'src/lib/db'
import levenshtein from 'fast-levenshtein'

function getDynamicThreshold(name: string): number {
  if (name.length < 6) return 1
  if (name.length <= 12) return 2
  return 3
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  }



  const { firstName, lastName, birthDate } = req.body

  if (!firstName || !lastName || !birthDate) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const inputDate = new Date(birthDate)
    const nextDay = new Date(inputDate)
    nextDay.setDate(nextDay.getDate() + 1)
    
    // 1. Fetch candidates with same birthdate and not merged/deleted
    const candidates = await prisma.resident.findMany({
      where: {
        birthDate: {
          gte: inputDate,
          lt: nextDay
        },
        isMerged: false,
        deletedAt: null
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        birthDate: true
      }
    })

    const duplicates = []

    const cleanInputFirstName = firstName.toLowerCase().replace(/\s+/g, '')
    const cleanInputLastName = lastName.toLowerCase().replace(/\s+/g, '')

    for (const candidate of candidates) {
      const cleanCandidateFirstName = candidate.firstName.toLowerCase().replace(/\s+/g, '')
      const cleanCandidateLastName = candidate.lastName.toLowerCase().replace(/\s+/g, '')

      const firstNameDistance = levenshtein.get(cleanInputFirstName, cleanCandidateFirstName)
      const lastNameDistance = levenshtein.get(cleanInputLastName, cleanCandidateLastName)

      const firstNameThreshold = getDynamicThreshold(cleanInputFirstName)
      const lastNameThreshold = getDynamicThreshold(cleanInputLastName)

      // If both distances are within their respective dynamic thresholds, consider it a potential duplicate
      if (firstNameDistance <= firstNameThreshold && lastNameDistance <= lastNameThreshold) {
        duplicates.push({
          id: candidate.id,
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          birthDate: candidate.birthDate,
          firstNameDistance,
          lastNameDistance
        })
      }
    }

    return res.status(200).json({ hasDuplicates: duplicates.length > 0, duplicates })
  } catch (error: any) {
    console.error('Check duplicate error:', error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
