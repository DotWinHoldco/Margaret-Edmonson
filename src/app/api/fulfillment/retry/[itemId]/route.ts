import { retryFulfillmentForItem } from '@/lib/fulfillment/router'
import { headers } from 'next/headers'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> },
) {
  const { itemId } = await params

  // Verify the request is authorized (admin or internal)
  const headersList = await headers()
  const secret = headersList.get('x-cron-secret')

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!itemId) {
    return Response.json({ error: 'itemId is required' }, { status: 400 })
  }

  try {
    const result = await retryFulfillmentForItem(itemId)

    return Response.json({
      itemId,
      success: result.success,
      externalOrderId: result.externalOrderId || null,
      error: result.error || null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Fulfillment retry error:', message)
    return Response.json({ error: message }, { status: 500 })
  }
}
