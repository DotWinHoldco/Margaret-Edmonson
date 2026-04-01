'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/cart/context'
import { trackEvent } from '@/lib/meta/pixel'

interface ProductImage {
  id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
}

interface ProductVariant {
  id: string
  name: string
  price: number
  sku: string | null
}

interface Product {
  id: string
  title: string
  slug: string
  description_html: string | null
  story_html: string | null
  medium: string | null
  dimensions: string | null
  base_price: number
  compare_at_price: number | null
  fulfillment_type: string
  is_original: boolean
  product_images: ProductImage[]
  product_variants: ProductVariant[]
}

interface RelatedProduct {
  id: string
  title: string
  slug: string
  base_price: number
  medium: string | null
  product_images: Array<{ url: string; alt_text: string | null; is_primary: boolean }>
}

export default function ProductDetail({
  product,
  relatedProducts,
}: {
  product: Product
  relatedProducts: RelatedProduct[]
}) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.product_variants?.[0] || null
  )
  const [showStory, setShowStory] = useState(false)
  const { dispatch } = useCart()

  const images = product.product_images?.sort((a, b) => a.sort_order - b.sort_order) || []
  const currentImage = images[selectedImage]
  const price = selectedVariant?.price ?? product.base_price

  function addToCart() {
    const eventId = crypto.randomUUID()
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        variantId: selectedVariant?.id,
        title: selectedVariant ? `${product.title} — ${selectedVariant.name}` : product.title,
        image: images[0]?.url || '',
        price,
        quantity: 1,
        fulfillmentType: product.fulfillment_type,
      },
    })

    trackEvent('AddToCart', {
      content_ids: [product.id],
      content_type: 'product',
      value: price,
      currency: 'USD',
    }, eventId)
  }

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 font-body text-sm text-charcoal/50">
          <Link href="/shop" className="hover:text-teal">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div>
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 rounded-sm group"
            >
              {currentImage && (
                <Image
                  src={currentImage.url}
                  alt={currentImage.alt_text || product.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
              {product.is_original && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-gold/90 text-white text-xs font-body font-semibold uppercase tracking-wider rounded-sm">
                  1 of 1 Original
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(i)}
                    className={`relative h-16 w-16 overflow-hidden rounded-sm border-2 transition-colors ${
                      selectedImage === i ? 'border-teal' : 'border-transparent'
                    }`}
                  >
                    <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-light text-charcoal">
              {product.title}
            </h1>

            {product.medium && (
              <p className="mt-2 font-hand text-lg text-charcoal/50">{product.medium}</p>
            )}
            {product.dimensions && (
              <p className="mt-1 font-body text-sm text-charcoal/50">{product.dimensions}</p>
            )}

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-body text-2xl font-semibold text-charcoal">
                ${price.toFixed(2)}
              </span>
              {product.compare_at_price && (
                <span className="font-body text-lg text-charcoal/40 line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.product_variants?.length > 0 && (
              <div className="mt-6">
                <label className="block text-xs font-body font-medium text-charcoal/70 mb-2">
                  Size / Option
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.product_variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 border rounded-sm font-body text-sm transition-colors ${
                        selectedVariant?.id === variant.id
                          ? 'border-teal bg-teal/5 text-teal'
                          : 'border-charcoal/15 text-charcoal/70 hover:border-charcoal/30'
                      }`}
                    >
                      {variant.name} — ${variant.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <button
              onClick={addToCart}
              className="mt-8 w-full py-3.5 bg-teal text-white font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:bg-teal/90 transition-colors"
            >
              Add to Cart
            </button>

            {/* Description */}
            {product.description_html && (
              <div
                className="mt-8 font-body text-sm leading-relaxed text-charcoal/70 prose prose-sm"
                dangerouslySetInnerHTML={{ __html: product.description_html }}
              />
            )}

            {/* Story */}
            {product.story_html && (
              <div className="mt-6 border-t border-charcoal/10 pt-4">
                <button
                  onClick={() => setShowStory(!showStory)}
                  className="flex items-center justify-between w-full font-body text-sm font-medium text-charcoal"
                >
                  Story Behind This Piece
                  <svg
                    className={`h-4 w-4 transition-transform ${showStory ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
                {showStory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 font-body text-sm text-charcoal/60 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: product.story_html }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="font-display text-2xl font-light text-charcoal mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rp) => {
                const img = rp.product_images?.find((i) => i.is_primary) || rp.product_images?.[0]
                return (
                  <Link key={rp.id} href={`/shop/art/${rp.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 rounded-sm">
                      {img && (
                        <Image
                          src={img.url}
                          alt={img.alt_text || rp.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 1024px) 50vw, 25vw"
                        />
                      )}
                    </div>
                    <h3 className="mt-3 font-body text-sm font-medium text-charcoal group-hover:text-teal transition-colors">
                      {rp.title}
                    </h3>
                    <p className="font-body text-sm text-charcoal/70">${rp.base_price.toFixed(2)}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
