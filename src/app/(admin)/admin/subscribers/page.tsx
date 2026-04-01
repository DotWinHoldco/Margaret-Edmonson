import type { Metadata } from 'next'
import SubscribersClient from './SubscribersClient'

export const metadata: Metadata = {
  title: 'Subscribers',
}

export default function SubscribersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light text-charcoal">
          Newsletter Subscribers
        </h1>
        <p className="mt-1 font-body text-sm text-charcoal/60">
          Manage your email subscriber list
        </p>
      </div>

      <SubscribersClient />
    </div>
  )
}
