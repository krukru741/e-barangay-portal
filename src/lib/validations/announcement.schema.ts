import { z } from 'zod'

export const announcementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  body: z.string().min(5, "Announcement body is required"),
  type: z.enum(['GENERAL', 'EMERGENCY', 'EVENT', 'ADVISORY']).optional().default('GENERAL'),
  isPinned: z.boolean().optional().default(false),
  expiresAt: z.string().optional().nullable(),
})

export type AnnouncementInput = z.infer<typeof announcementSchema>
