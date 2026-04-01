'use client'

import { useState, useEffect, use } from 'react'
import FunnelForm from '@/components/funnels/FunnelForm'

interface FunnelData {
  id: string
  product_id: string
  template: string
  slug: string
  is_published: boolean
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  problem_heading: string | null
  problem_body: string | null
  amplify_heading: string | null
  amplify_body: string | null
  story_heading: string | null
  story_body_html: string | null
  transformation_heading: string | null
  transformation_body: string | null
  offer_heading: string | null
  offer_original_description: string | null
  offer_print_description: string | null
  risk_reversal_heading: string | null
  risk_reversal_body: string | null
  final_cta_text: string | null
  products?: { title?: string } | null
}

export default function EditFunnelPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [funnel, setFunnel] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/funnels/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setFunnel(data.funnel)
        }
      })
      .catch(() => setError('Failed to load funnel.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div className="py-16 text-center text-charcoal/40 font-body">Loading...</div>
  }

  if (error || !funnel) {
    return (
      <div className="py-16 text-center">
        <p className="text-coral font-body">{error || 'Funnel not found.'}</p>
      </div>
    )
  }

  const productTitle = funnel.products?.title || 'Artwork'

  const initialData = {
    id: funnel.id,
    product_id: funnel.product_id,
    template: funnel.template,
    slug: funnel.slug,
    is_published: funnel.is_published,
    seo_title: funnel.seo_title || '',
    seo_description: funnel.seo_description || '',
    og_image_url: funnel.og_image_url || '',
    problem_heading: funnel.problem_heading || '',
    problem_body: funnel.problem_body || '',
    amplify_heading: funnel.amplify_heading || '',
    amplify_body: funnel.amplify_body || '',
    story_heading: funnel.story_heading || '',
    story_body_html: funnel.story_body_html || '',
    transformation_heading: funnel.transformation_heading || '',
    transformation_body: funnel.transformation_body || '',
    offer_heading: funnel.offer_heading || '',
    offer_original_description: funnel.offer_original_description || '',
    offer_print_description: funnel.offer_print_description || '',
    risk_reversal_heading: funnel.risk_reversal_heading || '',
    risk_reversal_body: funnel.risk_reversal_body || '',
    final_cta_text: funnel.final_cta_text || '',
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-charcoal">Edit Funnel</h1>
        <p className="text-charcoal/50 font-body text-sm mt-1">
          {productTitle} — /art/{funnel.slug}
        </p>
      </div>
      <FunnelForm mode="edit" initialData={initialData} />
    </div>
  )
}
