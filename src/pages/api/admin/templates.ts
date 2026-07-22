import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import { prisma } from 'src/lib/db'

export const DEFAULT_TEMPLATES: Record<string, string> = {
  CLEARANCE: `<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This is to certify that <strong>{{fullName}}</strong>, {{age}} years of age, 
  is a bona fide resident of {{address}}.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This is to certify further that he/she is known to us personally as a person of good moral character 
  and has no criminal record and no disciplinary action against this barangay.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This certification is hereby issued upon the request of the abovementioned person in connection 
  to his/her application for <strong>{{purpose}}</strong> or for whatever legal purpose that may serve him/her best.
</p>`,
  RESIDENCY: `<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This is to certify that <strong>{{fullName}}</strong>, {{age}} years of age, 
  is a bona fide resident of {{address}}.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  Based on records of this office, he/she has been residing in this barangay and is known to be a law-abiding citizen of good moral character.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This certification is being issued upon the request of the above-named person for <strong>{{purpose}}</strong> or whatever legal purposes it may serve.
</p>`,
  INDIGENCY: `<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This is to certify that <strong>{{fullName}}</strong>, {{age}} years of age, 
  is a bona fide resident of {{address}}.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This further certifies that the above-named person belongs to an indigent family in our barangay whose combined family income is insufficient to support their basic needs.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This certification is being issued upon the request of the above-named person for <strong>{{purpose}}</strong> or whatever legal purposes it may serve.
</p>`,
  GOOD_MORAL: `<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This is to certify that <strong>{{fullName}}</strong>, {{age}} years of age, 
  is a bona fide resident of {{address}}.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This is to certify further that he/she is a person of good moral character, has no derogatory record on file, and is a law-abiding citizen in this community.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This certification is hereby issued upon the request of the abovementioned person for <strong>{{purpose}}</strong>.
</p>`,
  BUSINESS: `<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This is to certify that the business or trade activity described below:
</p>
<div style="margin-left: 40px; margin-bottom: 16px;">
  <p><strong>Business Name:</strong> {{businessName}}</p>
  <p><strong>Address:</strong> {{businessAddress}}</p>
  <p><strong>Operator/Owner:</strong> {{fullName}}</p>
</div>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  has been granted a Barangay Clearance to operate within the territorial jurisdiction of this barangay, subject to the provisions of existing laws and ordinances.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This clearance is granted for the purpose of securing a <strong>{{purpose}}</strong>.
</p>`,
  ENDORSEMENT: `<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  This office respectfully endorses the application of <strong>{{fullName}}</strong>, {{age}} years of age, 
  and a bona fide resident of {{address}}.
</p>
<p style="text-indent: 40px; margin-bottom: 16px; text-align: justify;">
  The aforementioned individual is being endorsed for <strong>{{purpose}}</strong>. Any assistance extended to him/her will be highly appreciated by this office.
</p>`,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Public read - print view needs templates without requiring login
      const templates = await prisma.documentTemplate.findMany()
      const result = Object.keys(DEFAULT_TEMPLATES).map(type => {
        const saved = templates.find(t => t.type === type)
        return {
          type,
          contentHtml: saved ? saved.contentHtml : DEFAULT_TEMPLATES[type],
          isSaved: !!saved,
          id: saved?.id || null
        }
      })
      return res.status(200).json(result)
    }

    // Protect PUT - admin only
    const session = await getServerSession(req, res, authOptions)
    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes((session.user as any)?.role)) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.method === 'PUT') {
      const { type, contentHtml } = req.body
      if (!type || !contentHtml) {
        return res.status(400).json({ error: 'type and contentHtml are required' })
      }
      
      const existing = await prisma.documentTemplate.findFirst({ where: { type } })
      let template
      if (existing) {
        template = await prisma.documentTemplate.update({ where: { id: existing.id }, data: { contentHtml } })
      } else {
        template = await prisma.documentTemplate.create({ data: { type, contentHtml } })
      }
      return res.status(200).json(template)
    }

    res.setHeader('Allow', ['GET', 'PUT'])
    return res.status(405).end(`Method ${req.method} Not Allowed`)
  } catch (error: any) {
    console.error('API Error:', error)
    return res.status(500).json({ error: error.message || 'Internal Server Error' })
  }
}
