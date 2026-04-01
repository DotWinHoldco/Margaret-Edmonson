import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Meet Margaret Edmondson — mixed media artist, painter, and art educator. Learn about the story behind ArtByMe.',
}

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal">
            Our Story
          </h1>
          <div className="mt-3 mx-auto w-16 h-px bg-gold" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
            <Image
              src="/Margaret Edmondson/ARTWORK/Custom Portrait Options/image1.jpg"
              alt="Margaret Edmondson in the studio"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-charcoal mb-6">
              Art That Tells a Story
            </h2>
            <div className="font-body text-base leading-relaxed text-charcoal/70 space-y-4">
              <p>
                ArtByMe is the creative studio of Margaret Edmondson, a working artist specializing in mixed-media collage, oil painting, and art education.
              </p>
              <p>
                Every piece begins with a story — whether it&apos;s the quiet beauty of a mountain lodge at sunset, the vibrant energy of a desert in bloom, or the layered meaning found in vintage book pages and gold leaf.
              </p>
              <p>
                Margaret&apos;s work spans landscapes, nature studies, inspirational text art, and richly layered collage compositions incorporating found materials: vintage book pages, sheet music, stamps, textured papers, stitching, and gold leaf.
              </p>
              <p>
                Beyond creating, Margaret is passionate about teaching. Through art classes and workshops, she shares techniques, encourages experimentation, and helps others discover their creative voice.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-sm p-8 sm:p-12 lg:p-16 mb-24">
          <h2 className="font-display text-2xl sm:text-3xl font-light text-charcoal text-center mb-12">
            The Creative Process
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { title: 'Gather', description: 'Hours spent in antique shops and estate sales, seeking the perfect vintage materials that will tell a story.' },
              { title: 'Layer', description: 'Building depth through gesso, torn paper, and carefully placed elements — each layer adding meaning.' },
              { title: 'Finish', description: 'Gold leaf, hand-stitching, and final touches that bring warmth and a handcrafted quality to every piece.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <span className="font-hand text-4xl text-gold">{i + 1}</span>
                <h3 className="mt-2 font-display text-xl font-light text-charcoal">{step.title}</h3>
                <p className="mt-2 font-body text-sm text-charcoal/60">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            '/Margaret Edmondson/ARTWORK/Encouragement Series/image1.jpg',
            '/Margaret Edmondson/ARTWORK/Texas Themed/image5.jpg',
            '/Margaret Edmondson/ARTWORK/Beach and SC/image3.jpg',
            '/Margaret Edmondson/ARTWORK/Cactuses/image3.jpg',
          ].map((src, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-sm">
              <Image src={src} alt={`Studio work ${i + 1}`} fill className="object-cover" sizes="25vw" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
