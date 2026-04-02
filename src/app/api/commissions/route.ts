import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { client_name, client_email, client_phone, description, preferred_medium, preferred_size, budget_range, timeline } = body

  if (!client_name || !client_email || !description) {
    return Response.json({ error: 'Name, email, and description are required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('commissions')
    .insert({
      client_name,
      client_email,
      client_phone,
      description,
      preferred_medium,
      preferred_size,
      budget_range,
      timeline,
      status: 'inquiry',
    })
    .select()
    .single()

  if (error) {
    return Response.json({ error: 'Failed to submit commission' }, { status: 500 })
  }

  // Send notification email via Resend if configured
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
        subject: `New Commission Request from ${client_name}`,
        html: `<h2>New Commission Request</h2><p><strong>Name:</strong> ${client_name}</p><p><strong>Email:</strong> ${client_email}</p><p><strong>Medium:</strong> ${preferred_medium || 'Not specified'}</p><p><strong>Size:</strong> ${preferred_size || 'Not specified'}</p><p><strong>Budget:</strong> ${budget_range || 'Not specified'}</p><p><strong>Description:</strong></p><p>${description}</p>`,
      }),
    })
  }

  return Response.json({ success: true, commission: data })
}
