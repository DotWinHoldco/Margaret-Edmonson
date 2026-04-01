import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { email, source, first_name } = await request.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Valid email required' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  const { error } = await supabase
    .from('newsletter_subscribers')
    .upsert(
      { email: email.toLowerCase().trim(), first_name, source },
      { onConflict: 'email' }
    )

  if (error) {
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  return Response.json({ success: true })
}
