'use client'

import FunnelForm from '@/components/funnels/FunnelForm'

export default function NewFunnelPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-charcoal">Create Sales Funnel</h1>
        <p className="text-charcoal/50 font-body text-sm mt-1">
          Build a PASTOR landing page for a single artwork
        </p>
      </div>
      <FunnelForm mode="create" />
    </div>
  )
}
