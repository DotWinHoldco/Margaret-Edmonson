'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import type { Easing } from 'framer-motion'
import { useCart } from '@/lib/cart/context'
import { CHEAPEST_PRINT_PRICE } from '@/lib/pricing/canvas-prints'
import type { FunnelTemplateProps } from './types'

const ease: Easing = [0.22, 1, 0.36, 1]
const spring = { type: 'spring' as const, stiffness: 100, damping: 20 }

function Pop({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.97 }}
      transition={{ ...spring, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function BoldShowcaseTemplate({ funnel, product, images, variants }: FunnelTemplateProps) {
  const { dispatch } = useCart()
  const [selectedPrintVariant, setSelectedPrintVariant] = useState('')
  const heroImage = images[0]
  const detailImage = images[1] || images[0]
  const originalVariant = variants.find((v) => v.variant_type === 'original')
  const printVariants = variants.filter((v) => v.variant_type === 'canvas_print' || v.variant_type === 'framed_canvas_print')
  const canvasPrints = printVariants.filter((v) => v.variant_type === 'canvas_print')
  const framedPrints = printVariants.filter((v) => v.variant_type === 'framed_canvas_print')
  const originalSold = originalVariant && originalVariant.inventory_count <= 0

  const offerRef = useRef<HTMLElement>(null)
  const scrollToOffer = () => offerRef.current?.scrollIntoView({ behavior: 'smooth' })

  // Split title into words for stacked display
  const titleWords = product.title.split(' ')

  const lowestPrice = originalVariant && !originalSold
    ? originalVariant.price
    : printVariants.length > 0
      ? Math.min(...printVariants.map((v) => v.price))
      : product.base_price

  const handleAddToCart = (variant: { id: string; name: string; price: number; variant_type: string }) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        productId: product.id,
        variantId: variant.id,
        variantType: variant.variant_type,
        title: `${product.title} — ${variant.name}`,
        image: heroImage?.url || '',
        price: variant.price,
        quantity: 1,
        fulfillmentType: variant.variant_type === 'original' ? 'self_ship' : 'drop_ship',
      },
    })
  }

  const handleAddPrint = () => {
    const variant = printVariants.find((v) => v.id === selectedPrintVariant)
    if (variant) handleAddToCart(variant)
  }

  return (
    <div className="-mt-16 lg:-mt-20">
      {/* ===== HERO: Bold Asymmetric ===== */}
      <section className="relative min-h-screen bg-charcoal overflow-hidden">
        {/* Color wash background */}
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-teal via-transparent to-coral" />

        <div className="relative grid lg:grid-cols-5 min-h-screen items-center">
          {/* LEFT: Massive stacked title */}
          <div className="lg:col-span-2 px-6 sm:px-8 lg:px-12 py-16 lg:py-0 z-10 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <p className="font-body text-xs uppercase tracking-[0.4em] text-cream/40 mb-6">
                {product.medium || 'Original Artwork'}
              </p>
            </motion.div>

            <div className="space-y-0">
              {titleWords.map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -60 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.3 + i * 0.1 }}
                >
                  <span className="block font-editorial text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-cream font-bold leading-[0.95] uppercase tracking-tight">
                    {word}
                  </span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + titleWords.length * 0.1 }}
              className="mt-8 flex items-end gap-4"
            >
              <span className="font-display text-3xl sm:text-4xl text-cream font-bold">
                {printVariants.length > 0 ? `From $${CHEAPEST_PRINT_PRICE}` : `$${lowestPrice.toLocaleString()}`}
              </span>
              {originalVariant && !originalSold && (
                <span className="font-body text-sm text-cream/40 pb-1">
                  Original: ${originalVariant.price.toLocaleString()}
                </span>
              )}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 + titleWords.length * 0.1 }}
              onClick={scrollToOffer}
              className="mt-8 px-10 py-4 bg-teal text-cream font-body text-sm uppercase tracking-widest hover:bg-deep-teal transition-all hover:scale-[1.02] active:scale-[0.98] rounded-sm"
            >
              Get This Piece
            </motion.button>
          </div>

          {/* RIGHT: Artwork bleeding off edge */}
          {heroImage && (
            <motion.div
              initial={{ opacity: 0, scale: 1.05, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.1 }}
              className="lg:col-span-3 relative h-[50vh] lg:h-screen order-1 lg:order-2"
            >
              <Image
                src={heroImage.url}
                alt={heroImage.alt_text || product.title}
                fill
                className="object-cover object-center"
                priority
                sizes="(min-width: 1024px) 65vw, 100vw"
              />
              {/* Fade into dark on left side */}
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/20 to-transparent hidden lg:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent lg:hidden" />
            </motion.div>
          )}
        </div>
      </section>

      {/* ===== PROBLEM + AMPLIFY (Combined) ===== */}
      <section className="bg-[#1A1A1A] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <Pop>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-cream leading-tight uppercase">
              {funnel.problem_heading || 'Mass-produced art is a lie you hang on your wall.'}
            </h2>
          </Pop>
          <Pop delay={0.15}>
            <div className="mt-8 space-y-4">
              {(funnel.amplify_body || funnel.problem_body || "It's printed on thin canvas by a machine that prints ten thousand a day. It has no story. No soul. No fingerprint of a real human being who poured themselves into creating it.\n\nYou know this. Every time you look at it, you feel it.\n\nYou want something that hits different.").split('\n').map((p, i) => (
                <p key={i} className="font-body text-lg sm:text-xl text-cream/70 leading-relaxed max-w-3xl">
                  {p}
                </p>
              ))}
            </div>
          </Pop>
          <Pop delay={0.25}>
            <p className="mt-10 font-editorial text-2xl text-teal uppercase tracking-wide">
              {funnel.amplify_heading || 'Something with guts.'}
            </p>
          </Pop>
        </div>

        {/* Artwork strip across bottom */}
        {heroImage && (
          <Pop delay={0.3}>
            <div className="mt-16 relative h-32 md:h-48 overflow-hidden" style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)' }}>
              <Image
                src={heroImage.url}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-teal/20 mix-blend-multiply" />
            </div>
          </Pop>
        )}
      </section>

      {/* ===== STORY (Color-blocked) ===== */}
      <section className="bg-cream py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-0 md:gap-0 items-stretch">
            {/* Story text in color block */}
            <Pop>
              <div className="bg-charcoal p-8 md:p-12 flex flex-col justify-center min-h-[400px]">
                <p className="font-body text-xs uppercase tracking-[0.3em] text-teal mb-4">The Story</p>
                <h2 className="font-editorial text-2xl md:text-3xl text-cream leading-snug uppercase">
                  {funnel.story_heading || `Behind "${product.title}"`}
                </h2>
                <div
                  className="mt-6 font-body text-cream/70 leading-relaxed space-y-4 prose prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: funnel.story_body_html || product.story_html || `<p>This piece didn't come from a plan. It came from a feeling — the kind you can't name but can't ignore. Margaret picked up her brush and let it happen.</p><p>Working in ${product.medium || 'mixed media'}, she built layer upon layer until the piece spoke back to her. The result is raw, intentional, and alive with energy.</p>`,
                  }}
                />
              </div>
            </Pop>

            {/* Detail image with bold colored border */}
            {detailImage && (
              <Pop delay={0.1}>
                <div className="relative aspect-square md:aspect-auto md:h-full">
                  <div className="absolute inset-0 border-4 border-teal m-2 md:m-4 z-10 pointer-events-none" />
                  <Image
                    src={detailImage.url}
                    alt="Artwork detail"
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </div>
              </Pop>
            )}
          </div>

          {/* Artist info bar */}
          <Pop delay={0.2}>
            <div className="mt-0 bg-teal p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cream/20 flex items-center justify-center">
                  <span className="font-hand text-lg text-cream">ME</span>
                </div>
                <div>
                  <p className="font-display text-cream font-bold">Margaret Edmondson</p>
                  <p className="font-body text-sm text-cream/70">
                    {product.medium || 'Fine Art'} {product.dimensions ? `\u2014 ${product.dimensions}` : ''}
                  </p>
                </div>
              </div>
              <Link href="/about" className="font-body text-sm text-cream/80 underline underline-offset-4 hover:text-cream transition-colors">
                Meet the Artist
              </Link>
            </div>
          </Pop>
        </div>
      </section>

      {/* ===== TRANSFORMATION ===== */}
      <section className="bg-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <Pop>
            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-charcoal leading-tight uppercase text-center">
              {funnel.transformation_heading || "It's Not Just a Painting. It's a Mood."}
            </h2>
          </Pop>
          <Pop delay={0.15}>
            <div className="mt-8 text-center max-w-2xl mx-auto space-y-4">
              {(funnel.transformation_body || "It shifts the energy of every room it enters. Visitors notice it before they notice anything else. It becomes the piece people talk about, photograph, and remember.\n\nThis isn't decoration. This is a statement.").split('\n').map((p, i) => (
                <p key={i} className="font-body text-lg text-charcoal/70 leading-relaxed">{p}</p>
              ))}
            </div>
          </Pop>

          {/* Bold pull-quote */}
          <Pop delay={0.25}>
            <div className="mt-12 bg-charcoal p-8 md:p-12 text-center">
              <p className="font-editorial text-2xl md:text-3xl text-cream uppercase leading-snug">
                &ldquo;The right art doesn&apos;t just decorate a room. It defines it.&rdquo;
              </p>
            </div>
          </Pop>
        </div>
      </section>

      {/* ===== OFFER (High-contrast horizontal) ===== */}
      <section ref={offerRef} className="bg-cream py-24 md:py-32" id="offer">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Artwork preview */}
            {heroImage && (
              <Pop>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-[4/5] rounded-sm overflow-hidden shadow-2xl"
                >
                  <Image
                    src={heroImage.url}
                    alt={product.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </motion.div>
              </Pop>
            )}

            {/* Purchase options */}
            <div className="space-y-6">
              <Pop delay={0.1}>
                <p className="font-body text-xs uppercase tracking-[0.3em] text-charcoal/40">
                  {product.medium || 'Fine Art'} {product.dimensions ? `\u2014 ${product.dimensions}` : ''}
                </p>
                <h2 className="font-editorial text-3xl md:text-4xl text-charcoal uppercase mt-2">
                  {funnel.offer_heading || product.title}
                </h2>
              </Pop>

              {/* Original */}
              {originalVariant && (
                <Pop delay={0.2}>
                  <div className="relative bg-charcoal p-6 md:p-8 rounded-sm overflow-hidden">
                    {originalSold && (
                      <div className="absolute inset-0 bg-charcoal/90 z-20 flex items-center justify-center">
                        <span className="font-editorial text-4xl text-cream/30 uppercase tracking-widest -rotate-12">Sold</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-body text-xs uppercase tracking-widest text-teal font-bold">The Original</p>
                      {!originalSold && (
                        <span className="text-xs font-body text-coral uppercase tracking-wider font-bold animate-pulse">
                          Only 1 exists
                        </span>
                      )}
                    </div>
                    <p className="font-editorial text-4xl text-cream font-bold">${originalVariant.price.toLocaleString()}</p>
                    <p className="mt-3 font-body text-cream/60 text-sm leading-relaxed">
                      {funnel.offer_original_description || `The one and only original. Own the real thing.`}
                    </p>
                    <button
                      onClick={() => handleAddToCart(originalVariant)}
                      disabled={!!originalSold}
                      className="mt-6 w-full py-4 bg-teal text-cream font-body text-sm uppercase tracking-widest hover:bg-deep-teal transition-all hover:scale-[1.01] active:scale-[0.99] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {originalSold ? 'Sold' : 'Add Original to Cart'}
                    </button>
                  </div>
                </Pop>
              )}

              {/* Prints */}
              {product.prints_enabled && printVariants.length > 0 && (
                <Pop delay={originalVariant ? 0.3 : 0.2}>
                  <div className="bg-white border-2 border-charcoal/10 p-6 md:p-8 rounded-sm">
                    <p className="font-body text-xs uppercase tracking-widest text-gold font-bold mb-4">Museum-Quality Prints</p>
                    <p className="font-body text-charcoal/70 text-sm leading-relaxed mb-6">
                      {funnel.offer_print_description || 'Premium gallery-wrapped canvas. Vibrant, archival-quality reproduction.'}
                    </p>

                    <select
                      value={selectedPrintVariant}
                      onChange={(e) => setSelectedPrintVariant(e.target.value)}
                      className="w-full border-2 border-charcoal/15 rounded-sm px-4 py-3 font-body text-charcoal bg-white focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal"
                    >
                      <option value="">Select size & style...</option>
                      {canvasPrints.length > 0 && (
                        <optgroup label="Canvas Print">
                          {canvasPrints.map((v) => (
                            <option key={v.id} value={v.id}>{v.name} — ${v.price.toLocaleString()}</option>
                          ))}
                        </optgroup>
                      )}
                      {framedPrints.length > 0 && (
                        <optgroup label="Framed Canvas">
                          {framedPrints.map((v) => (
                            <option key={v.id} value={v.id}>{v.name} — ${v.price.toLocaleString()}</option>
                          ))}
                        </optgroup>
                      )}
                    </select>

                    <button
                      onClick={handleAddPrint}
                      disabled={!selectedPrintVariant}
                      className="mt-4 w-full py-4 bg-charcoal text-cream font-body text-sm uppercase tracking-widest hover:bg-charcoal/90 transition-all hover:scale-[1.01] active:scale-[0.99] rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Add Print to Cart
                    </button>
                  </div>
                </Pop>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== RISK REVERSAL + FINAL CTA (Combined) ===== */}
      <section className="bg-charcoal py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          {/* Guarantee badges */}
          <Pop>
            <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
              {[
                { icon: '\u2714', label: 'Arrives Perfect' },
                { icon: '\uD83D\uDD12', label: 'Secure Checkout' },
                { icon: '\u2764\uFE0F', label: 'Satisfaction Promise' },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full border border-teal/30 flex items-center justify-center text-lg mb-2">
                    {badge.icon}
                  </div>
                  <p className="font-body text-xs uppercase tracking-widest text-cream/60">{badge.label}</p>
                </div>
              ))}
            </div>
          </Pop>

          {/* Big final CTA */}
          <Pop delay={0.15}>
            <div className="text-center">
              <h2 className="font-editorial text-3xl md:text-5xl text-cream uppercase leading-tight">
                {funnel.final_cta_text || "Don't sleep on this one."}
              </h2>
              <p className="mt-4 font-body text-cream/50 text-lg">
                {originalVariant && !originalSold
                  ? "One original. One chance. That's it."
                  : 'Bring home a piece that actually means something.'}
              </p>
            </div>
          </Pop>

          <Pop delay={0.25}>
            <button
              onClick={scrollToOffer}
              className="mt-10 w-full max-w-xl mx-auto block py-5 bg-teal text-cream font-body text-base uppercase tracking-widest hover:bg-deep-teal transition-all hover:scale-[1.01] active:scale-[0.99] rounded-sm text-center"
            >
              Add to Cart
            </button>
          </Pop>

          <Pop delay={0.3}>
            <div className="mt-12 flex items-center justify-center gap-6 text-cream/30 font-body text-sm">
              <Link href="/shop" className="hover:text-cream/60 transition-colors">Gallery</Link>
              <span>/</span>
              <Link href="/about" className="hover:text-cream/60 transition-colors">Artist</Link>
              <span>/</span>
              <Link href="/contact" className="hover:text-cream/60 transition-colors">Contact</Link>
            </div>
          </Pop>
        </div>
      </section>
    </div>
  )
}
