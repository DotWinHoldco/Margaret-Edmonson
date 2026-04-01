import type { Metadata } from 'next'
import PageForm from './PageForm'

export const metadata: Metadata = {
  title: 'Create Page',
}

export default function NewPagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light text-charcoal">
          Create Page
        </h1>
        <p className="mt-1 font-body text-sm text-charcoal/60">
          Add a new page to your site
        </p>
      </div>

      <PageForm />
    </div>
  )
}
