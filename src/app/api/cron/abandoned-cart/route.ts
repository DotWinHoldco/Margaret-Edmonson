import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email/send'

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://artbyme.studio'

  for (const cart of step1Carts || []) {
    await sendEmail({
      to: cart.email,
      subject: 'You left something beautiful behind — ArtByME',
      html: `<div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #2C2C2C;"><div style="text-align: center; margin-bottom: 32px;"><h1 style="font-size: 28px; font-weight: 300; margin: 0;">ArtBy<span style="font-weight: 700;">ME</span></h1></div><h2 style="font-size: 20px; font-weight: 400; text-align: center;">You left something beautiful behind</h2><p style="text-align: center; color: #666; font-size: 14px; line-height: 1.6;">Your cart at ArtByME is waiting for you. Don't let these one-of-a-kind pieces slip away.</p><div style="text-align: center; margin: 28px 0;"><a href="${siteUrl}/cart" style="display: inline-block; background: #3A7D7B; color: white; padding: 14px 36px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600;">Return to Your Cart</a></div></div>`,
    })
    await supabase.from('carts').update({ abandoned_email_1_sent_at: now.toISOString() }).eq('id', cart.id)
    sent++
  }

  for (const cart of step2Carts || []) {
    await sendEmail({
      to: cart.email,
      subject: 'Still thinking about it? — ArtByME',
      html: `<div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #2C2C2C;"><div style="text-align: center; margin-bottom: 32px;"><h1 style="font-size: 28px; font-weight: 300; margin: 0;">ArtBy<span style="font-weight: 700;">ME</span></h1></div><h2 style="font-size: 20px; font-weight: 400; text-align: center;">Still thinking about it?</h2><p style="text-align: center; color: #666; font-size: 14px; line-height: 1.6;">Margaret's originals are one-of-a-kind — once they're gone, they're gone. Your cart is still waiting.</p><div style="text-align: center; margin: 28px 0;"><a href="${siteUrl}/cart" style="display: inline-block; background: #3A7D7B; color: white; padding: 14px 36px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600;">Complete Your Purchase</a></div></div>`,
    })
    await supabase.from('carts').update({ abandoned_email_2_sent_at: now.toISOString() }).eq('id', cart.id)
    sent++
  }

  for (const cart of step3Carts || []) {
    await sendEmail({
      to: cart.email,
      subject: 'Last chance — your cart is waiting — ArtByME',
      html: `<div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #2C2C2C;"><div style="text-align: center; margin-bottom: 32px;"><h1 style="font-size: 28px; font-weight: 300; margin: 0;">ArtBy<span style="font-weight: 700;">ME</span></h1></div><h2 style="font-size: 20px; font-weight: 400; text-align: center;">Last chance</h2><p style="text-align: center; color: #666; font-size: 14px; line-height: 1.6;">Your cart will expire soon. If you've been eyeing one of Margaret's pieces, now's the time.</p><div style="text-align: center; margin: 28px 0;"><a href="${siteUrl}/cart" style="display: inline-block; background: #D4654A; color: white; padding: 14px 36px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600;">Don't Miss Out</a></div></div>`,
    })
    await supabase.from('carts').update({ abandoned_email_3_sent_at: now.toISOString() }).eq('id', cart.id)
    sent++
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
