import { createClient } from '@/lib/supabase/server'
import { sendWelcomeSubscriber } from '@/lib/email/send'

export async function POST(request: Request) {
  const { email, source, first_name } = await request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email required' }, { status: 400 })
  }

  const supabase = await createClient()
  const normalizedEmail = email.toLowerCase().trim()

  // Check if already subscribed (don't re-send welcome)
  const { data: existing } = await supabase
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email: normalizedEmail, first_name, source },
      { onConflict: 'email' }
    )

  if (error) {
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  // Send welcome email only for new subscribers
  if (!existing) {
    try {
      await sendWelcomeSubscriber(normalizedEmail, first_name)
    } catch (err) {
      console.error('Welcome email failed:', err)
    }
  }

  return Response.json({ success: true })
}
