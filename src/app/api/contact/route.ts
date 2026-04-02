import { sendEmail } from '@/lib/email/send'

export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json()

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  await sendEmail({
    to: 'hello@artbyme.studio',
    subject: `[ArtByME Contact] ${subject}: from ${name}`,
    html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
    replyTo: email,
  })

  return Response.json({ success: true })
}
