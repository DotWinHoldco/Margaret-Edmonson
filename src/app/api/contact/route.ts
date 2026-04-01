export async function POST(request: Request) {
  const { name, email, subject, message } = await request.json()

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Send via Resend if configured
  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'ArtByMe <hello@artbyme.studio>',
        to: 'hello@artbyme.studio',
        reply_to: email,
        subject: `[ArtByMe Contact] ${subject}: from ${name}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
      }),
    })
  }

  return Response.json({ success: true })
}
