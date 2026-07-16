/**
 * Mock Communication Service
 * 
 * As requested by the user, this currently uses console.log() to mock SMS and Email sending.
 * This prevents costs and API rate limits during local development.
 * 
 * Once ready for production, simply replace the internals of these functions with:
 * - SMS: fetch() call to Semaphore API (https://semaphore.co/api)
 * - Email: Nodemailer transport or Resend API
 */

export async function sendBulkSMS(phoneNumbers: string[], message: string) {
  console.log('=========================================')
  console.log('📱 [MOCK SMS GATEWAY] Sending SMS...')
  console.log(`To: ${phoneNumbers.join(', ')}`)
  console.log(`Message: "${message}"`)
  console.log('=========================================')
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true, count: phoneNumbers.length }
}

export async function sendBulkEmail(emails: string[], subject: string, body: string) {
  console.log('=========================================')
  console.log('📧 [MOCK EMAIL GATEWAY] Sending Email...')
  console.log(`To: ${emails.join(', ')}`)
  console.log(`Subject: "${subject}"`)
  console.log(`Body:\n${body}`)
  console.log('=========================================')

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return { success: true, count: emails.length }
}
