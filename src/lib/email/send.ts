const RESEND_API = 'https://api.resend.com/emails'

interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email:', subject)
    return null
  }

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || 'ArtByME <hello@artbyme.studio>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { reply_to: replyTo } : {}),
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend email failed:', res.status, err)
    return null
  }

  return res.json()
}

// ─── Branded wrapper ─────────────────────────────────────────────────
function brandedWrapper(content: string) {
  return `
<div style="font-family: Georgia, 'Times New Roman', serif; max-width: 560px; margin: 0 auto; padding: 40px 24px; color: #2C2C2C; background: #FAF7F2;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="font-size: 28px; font-weight: 300; letter-spacing: 0.03em; margin: 0;">ArtBy<span style="font-weight: 700;">ME</span></h1>
    <p style="color: #3A7D7B; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">Margaret Edmondson</p>
  </div>
  ${content}
  <hr style="border: none; border-top: 1px solid #e5e0d8; margin: 32px 0 16px;" />
  <p style="text-align: center; color: #C9A84C; font-size: 11px; letter-spacing: 0.05em;">Mixed media, paintings &amp; collage by Margaret Edmondson</p>
  <p style="text-align: center; color: #999; font-size: 10px; margin-top: 8px;">
    <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://artbyme.studio'}" style="color: #3A7D7B; text-decoration: none;">artbyme.studio</a>
  </p>
</div>`
}

// ─── Order Confirmation ──────────────────────────────────────────────
interface OrderItem {
  name: string
  quantity: number
  price: number
  variant?: string
}

export async function sendOrderConfirmation(
  email: string,
  orderId: string,
  items: OrderItem[],
  total: number
) {
  const itemRows = items
    .map(
      (i) =>
        `<tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px;">${i.name}${i.variant ? `<br><span style="color: #888; font-size: 12px;">${i.variant}</span>` : ''}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${i.quantity}</td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 14px;">$${i.price.toFixed(2)}</td>
        </tr>`
    )
    .join('')

  const html = brandedWrapper(`
    <h2 style="font-size: 20px; font-weight: 400; text-align: center; margin-bottom: 8px;">Thank You for Your Order!</h2>
    <p style="text-align: center; color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Your order has been confirmed and is being prepared. You'll receive shipping updates as your art is on its way.
    </p>
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 1px solid #e5e0d8;">
      <p style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 12px;">Order #${orderId.slice(0, 8).toUpperCase()}</p>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="text-align: left; padding: 8px 0; border-bottom: 2px solid #2C2C2C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Item</th>
            <th style="text-align: center; padding: 8px 0; border-bottom: 2px solid #2C2C2C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
            <th style="text-align: right; padding: 8px 0; border-bottom: 2px solid #2C2C2C; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 14px;">Total</td>
            <td style="padding: 12px 0; text-align: right; font-weight: 700; font-size: 16px; color: #3A7D7B;">$${total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
    <p style="text-align: center; color: #666; font-size: 13px; line-height: 1.6;">
      Questions about your order? Reply to this email or reach out at
      <a href="mailto:hello@artbyme.studio" style="color: #3A7D7B;">hello@artbyme.studio</a>
    </p>
  `)

  return sendEmail({
    to: email,
    subject: `ArtByME — Order Confirmed #${orderId.slice(0, 8).toUpperCase()}`,
    html,
    replyTo: 'hello@artbyme.studio',
  })
}

// ─── Welcome Subscriber ──────────────────────────────────────────────
export async function sendWelcomeSubscriber(email: string, firstName?: string) {
  const greeting = firstName ? `Hi ${firstName},` : 'Welcome!'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://artbyme.studio'

  const html = brandedWrapper(`
    <h2 style="font-size: 20px; font-weight: 400; text-align: center; margin-bottom: 8px;">${greeting}</h2>
    <p style="text-align: center; color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Thank you for subscribing to ArtByME. You'll be the first to know about new artwork, upcoming shows, and exclusive offers from Margaret Edmondson.
    </p>
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${siteUrl}/shop" style="display: inline-block; background: #3A7D7B; color: white; padding: 14px 36px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600;">Browse the Collection</a>
    </div>
    <p style="text-align: center; color: #999; font-size: 12px;">
      You can unsubscribe at any time by clicking the link in future emails.
    </p>
  `)

  return sendEmail({
    to: email,
    subject: 'Welcome to ArtByME — Margaret Edmondson',
    html,
  })
}

// ─── Shipping Update ─────────────────────────────────────────────────
export async function sendShippingUpdate(
  email: string,
  orderId: string,
  trackingUrl?: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://artbyme.studio'

  const trackingBlock = trackingUrl
    ? `<div style="text-align: center; margin-bottom: 24px;">
        <a href="${trackingUrl}" style="display: inline-block; background: #3A7D7B; color: white; padding: 14px 36px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600;">Track Your Shipment</a>
      </div>`
    : `<p style="text-align: center; color: #666; font-size: 14px;">Tracking details will be available shortly.</p>`

  const html = brandedWrapper(`
    <h2 style="font-size: 20px; font-weight: 400; text-align: center; margin-bottom: 8px;">Your Art Is On Its Way!</h2>
    <p style="text-align: center; color: #666; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
      Great news — order #${orderId.slice(0, 8).toUpperCase()} has shipped.
    </p>
    ${trackingBlock}
    <p style="text-align: center; color: #999; font-size: 12px;">
      Questions? Reply to this email or visit <a href="${siteUrl}" style="color: #3A7D7B;">artbyme.studio</a>
    </p>
  `)

  return sendEmail({
    to: email,
    subject: `ArtByME — Your Order Has Shipped #${orderId.slice(0, 8).toUpperCase()}`,
    html,
    replyTo: 'hello@artbyme.studio',
  })
}
