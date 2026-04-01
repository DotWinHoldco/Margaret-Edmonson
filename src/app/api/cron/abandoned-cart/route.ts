import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createServiceClient()
  const now = new Date()

  // Step 1: 1 hour abandoned carts
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString()
  const { data: step1Carts } = await supabase
    .from('carts')
    .select('*')
    .not('email', 'is', null)
    .is('converted_order_id', null)
    .is('abandoned_email_1_sent_at', null)
    .lt('last_activity_at', oneHourAgo)

  // Step 2: 24 hour carts
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
  const { data: step2Carts } = await supabase
    .from('carts')
    .select('*')
    .not('email', 'is', null)
    .is('converted_order_id', null)
    .not('abandoned_email_1_sent_at', 'is', null)
    .is('abandoned_email_2_sent_at', null)
    .lt('last_activity_at', twentyFourHoursAgo)

  // Step 3: 72 hour carts
  const seventyTwoHoursAgo = new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString()
  const { data: step3Carts } = await supabase
    .from('carts')
    .select('*')
    .not('email', 'is', null)
    .is('converted_order_id', null)
    .not('abandoned_email_2_sent_at', 'is', null)
    .is('abandoned_email_3_sent_at', null)
    .lt('last_activity_at', seventyTwoHoursAgo)

  let sent = 0

  // Process each step
  for (const cart of step1Carts || []) {
    if (process.env.RESEND_API_KEY) {
      await sendAbandonedCartEmail(cart, 1)
      await supabase.from('carts').update({ abandoned_email_1_sent_at: now.toISOString() }).eq('id', cart.id)
      sent++
    }
  }

  for (const cart of step2Carts || []) {
    if (process.env.RESEND_API_KEY) {
      await sendAbandonedCartEmail(cart, 2)
      await supabase.from('carts').update({ abandoned_email_2_sent_at: now.toISOString() }).eq('id', cart.id)
      sent++
    }
  }

  for (const cart of step3Carts || []) {
    if (process.env.RESEND_API_KEY) {
      await sendAbandonedCartEmail(cart, 3)
      await supabase.from('carts').update({ abandoned_email_3_sent_at: now.toISOString() }).eq('id', cart.id)
      sent++
    }
  }

  return Response.json({
    success: true,
    processed: {
      step1: step1Carts?.length || 0,
      step2: step2Carts?.length || 0,
      step3: step3Carts?.length || 0,
    },
    sent,
  })
}

async function sendAbandonedCartEmail(cart: { email: string; items: unknown }, step: number) {
  const subjects: Record<number, string> = {
    1: 'You left something beautiful behind',
    2: 'Still thinking about it? Here\'s 10% off',
    3: 'Last chance — your cart is waiting',
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'ArtByMe <hello@artbyme.studio>',
      to: cart.email,
      subject: subjects[step],
      html: `<h2>${subjects[step]}</h2><p>Your cart at ArtByMe is waiting for you.</p><p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/cart">Return to your cart</a></p>`,
    }),
  })
}
