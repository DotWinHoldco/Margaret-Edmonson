import type { Metadata } from 'next'
import FaqTestimonialsClient from './FaqTestimonialsClient'

export const metadata: Metadata = {
  title: 'FAQ & Testimonials',
}

export default function FaqTestimonialsPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-light text-charcoal">
        FAQ & Testimonials
      </h1>

      <FaqTestimonialsClient />
    </div>
  )
}
