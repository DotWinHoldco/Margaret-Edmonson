import { getProducts } from '@/lib/supabase/queries'
import GalleryGrid from '@/components/marketing/GalleryGrid'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Browse the complete collection of original mixed-media collage, oil paintings, and watercolors by Margaret Edmondson.',
}

export default async function GalleryPage() {
  const { products } = await getProducts({ limit: 50 })

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal">
            Gallery
          </h1>
          <div className="mt-3 mx-auto w-16 h-px bg-gold" />
          <p className="mt-4 font-body text-charcoal/60 max-w-xl mx-auto">
            Original artwork, mixed-media collage, and fine art by Margaret Edmondson
          </p>
        </div>

        <GalleryGrid products={products} />
      </div>
    </div>
  )
}
