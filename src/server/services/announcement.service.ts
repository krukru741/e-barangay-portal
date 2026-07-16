import { findAllAnnouncements, createAnnouncementRecord, updateAnnouncementPin, deleteAnnouncementRecord } from '../repositories/announcement.repository'
import { AnnouncementInput } from 'src/lib/validations/announcement.schema'
import { UserRole } from '@prisma/client'
import { sendBulkSMS, sendBulkEmail } from 'src/lib/communications'

function canManageAnnouncements(userRole?: UserRole) {
  if (userRole !== UserRole.ADMIN && userRole !== UserRole.STAFF && userRole !== UserRole.OFFICIAL && userRole !== UserRole.SUPER_ADMIN) {
    throw new Error('FORBIDDEN: You do not have permission to manage announcements')
  }
}

export async function getAnnouncements() {
  // Anyone can read announcements (even unauthenticated residents if they visit the page, but let's assume they are logged in)
  return await findAllAnnouncements()
}

export async function createAnnouncement(data: AnnouncementInput, userRole: UserRole) {
  canManageAnnouncements(userRole)
  
  const announcement = await createAnnouncementRecord(data)
  
  // If it's an emergency, we immediately trigger SMS/Email broadcasts
  if (data.type === 'EMERGENCY') {
    // In a real app, you would fetch all resident phone numbers and emails here
    const mockPhones = ['09171234567', '09181234567']
    const mockEmails = ['juan@example.com', 'maria@example.com']
    
    // Fire and forget (don't await so we don't block the API response)
    sendBulkSMS(mockPhones, `BARANGAY EMERGENCY: ${data.title}. ${data.body}`)
    sendBulkEmail(mockEmails, `EMERGENCY ALERT: ${data.title}`, data.body)
  }

  return announcement
}

export async function toggleAnnouncementPin(id: string, isPinned: boolean, userRole: UserRole) {
  canManageAnnouncements(userRole)
  return await updateAnnouncementPin(id, isPinned)
}

export async function deleteAnnouncement(id: string, userRole: UserRole) {
  canManageAnnouncements(userRole)
  return await deleteAnnouncementRecord(id)
}
