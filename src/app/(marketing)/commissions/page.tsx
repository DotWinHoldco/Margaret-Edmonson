import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Commissions',
  description: 'Commission a custom piece of artwork by Margaret Edmondson. From concept to completion, we bring your vision to life.',
}

const STEPS = [
  { num: 1, title: 'Inquire', desc: 'Share your vision, reference photos, preferred medium, size, and budget. We\'ll discuss your ideas and provide a quote.' },
  { num: 2, title: 'Approve Sketch', desc: 'Once the deposit is paid, we create initial sketches for your approval. We\'ll refine until you\'re delighted.' },
  { num: 3, title: 'Creation', desc: 'Your piece comes to life in the studio. Receive progress photos along the way so you can follow the journey.' },
  { num: 4, title: 'Delivery', desc: 'Final payment, professional packaging, and insured shipping straight to your door. Your story, on your walls.' },
]

const PRICING = [
  { size: 'Small (up to 12×16")', range: '$200 – $400' },
  { size: 'Medium (16×20" – 20×24")', range: '$400 – $700' },
  { size: 'Large (24×30" – 30×40")', range: '$700 – $1,200' },
  { size: 'Extra Large (36×48"+)', range: '$1,200+' },
]

export default function CommissionsPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal">
            Custom Commissions
          </h1>
          <div className="mt-3 mx-auto w-16 h-px bg-gold" />
          <p className="mt-4 font-body text-lg text-charcoal/60 max-w-2xl mx-auto">
            Your story, our canvas. Commission a one-of-a-kind piece of art created just for you.
          </p>
        </div>

        {/* Example Work */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-20">
          {[
            '/Margaret Edmondson/ARTWORK/Custom Portrait Options/image2.jpg',
            '/Margaret Edmondson/ARTWORK/Custom Portrait Options/image3.jpg',
            '/Margaret Edmondson/ARTWORK/Custom Portrait Options/image4.jpg',
            '/Margaret Edmondson/ARTWORK/Custom Portrait Options/image5.jpg',
          ].map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-sm">
              <Image src={src} alt={`Commission example ${i + 1}`} fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mb-20">
          <h2 className="font-display text-2xl sm:text-3xl font-light text-charcoal text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 font-hand text-2xl text-teal">
                  {step.num}
                </span>
                <h3 className="mt-4 font-display text-lg font-light text-charcoal">{step.title}</h3>
                <p className="mt-2 font-body text-sm text-charcoal/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Guide */}
        <div className="bg-white rounded-sm p-8 sm:p-12 mb-20">
          <h2 className="font-display text-2xl font-light text-charcoal text-center mb-8">
            Pricing Guide
          </h2>
          <div className="max-w-lg mx-auto space-y-3">
            {PRICING.map((tier) => (
              <div key={tier.size} className="flex justify-between items-center py-3 border-b border-charcoal/5 last:border-0">
                <span className="font-body text-sm text-charcoal/70">{tier.size}</span>
                <span className="font-body text-sm font-semibold text-charcoal">{tier.range}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-center font-body text-xs text-charcoal/40">
            Prices vary by medium, complexity, and materials. Final quote provided after consultation.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/commissions/request"
            className="inline-flex items-center justify-center px-10 py-4 bg-teal text-white font-body text-sm font-medium tracking-wider uppercase rounded-sm hover:bg-teal/90 transition-colors"
          >
            Start Your Commission
          </Link>
        </div>
      </div>
    </div>
  )
}
