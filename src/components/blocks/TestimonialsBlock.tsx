'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface Testimonial {
  id: string
  name: string
  role?: string
  quote: string
  avatar_url?: string
}

interface TestimonialsConfig {
  heading?: string
  testimonials?: Testimonial[]
  auto_rotate?: boolean
  display_style?: 'carousel' | 'grid'
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Sarah Mitchell', role: 'Collector', quote: 'The mixed media collage I commissioned for our living room is absolutely breathtaking. Margaret captured exactly what I envisioned — layers of texture and meaning that tell our family\'s story.' },
  { id: '2', name: 'James Porter', role: 'Student', quote: 'Taking the watercolor class opened up a whole new world for me. Margaret\'s teaching style is warm, patient, and incredibly inspiring. I\'ve never felt more creative.' },
  { id: '3', name: 'Linda Chen', role: 'Commission Client', quote: 'From the first sketch to the final piece, the commission process was wonderful. Communication was clear, updates were frequent, and the result exceeded my wildest expectations.' },
]

export default function TestimonialsBlock({ config }: { config: Record<string, unknown>; variant?: string }) {
  const c = config as unknown as TestimonialsConfig
  const heading = c.heading || 'What People Are Saying'
  const testimonials = c.testimonials || FALLBACK_TESTIMONIALS
  const autoRotate = c.auto_rotate !== false
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!autoRotate || testimonials.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [autoRotate, testimonials.length])

  return (
    <section className="py-24 sm:py-32 bg-cream">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl font-light text-charcoal"
        >
          {heading}
        </motion.h2>
        <div className="mt-3 mx-auto w-16 h-px bg-gold" />

        <div className="mt-12 relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
            >
              <blockquote>
                <p className="font-body text-lg sm:text-xl leading-relaxed text-charcoal/80 italic">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>
                <footer className="mt-6">
                  <p className="font-body font-semibold text-charcoal">
                    {testimonials[current].name}
                  </p>
                  {testimonials[current].role && (
                    <p className="font-hand text-base text-teal mt-0.5">
                      {testimonials[current].role}
                    </p>
                  )}
                </footer>
              </blockquote>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-teal w-6' : 'bg-charcoal/20 hover:bg-charcoal/40'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
