import { routeOrderToFulfillment } from '@/lib/fulfillment/router'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  // Verify the request is authorized (internal cron or admin)
  const headersList = await headers()
  const secret = headersList.get('x-cron-secret')

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { orderId?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  if (!body.orderId) {
    return Response.json({ error: 'orderId is required' }, { status: 400 })
  }

  try {
    const results = await routeOrderToFulfillment(body.orderId)

    const succeeded = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    return Response.json({
      orderId: body.orderId,
      total: results.length,
      succeeded: succeeded.length,
      failed: failed.length,
      results,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Fulfillment submission error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
