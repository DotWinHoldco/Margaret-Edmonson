import { getPublishedCourses } from '@/lib/supabase/queries'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Art Classes',
  description: 'Learn to create with hands-on art classes taught by Margaret Edmondson. Mixed media, oil painting, watercolor, and more.',
}

export default async function ClassesPage() {
  const courses = await getPublishedCourses()

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-charcoal">
            Art Classes
          </h1>
          <div className="mt-3 mx-auto w-16 h-px bg-gold" />
          <p className="mt-4 font-body text-lg text-charcoal/60 max-w-2xl mx-auto">
            Learn to create with hands-on classes taught by working artists
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link key={course.id} href={`/classes/${course.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-charcoal/5">
                {course.thumbnail_url && (
                  <Image
                    src={course.thumbnail_url}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                )}
                {course.difficulty_level && (
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-white/90 text-xs font-body font-medium text-charcoal rounded-sm capitalize">
                    {course.difficulty_level.replace('_', ' ')}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h2 className="font-display text-lg font-light text-charcoal group-hover:text-teal transition-colors">
                  {course.title}
                </h2>
                {course.description && (
                  <p className="mt-1 font-body text-sm text-charcoal/60 line-clamp-2">{course.description}</p>
                )}
                <p className="mt-2 font-body text-sm font-medium text-teal">
                  {course.price ? `$${course.price}` : 'Free'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {courses.length === 0 && (
          <p className="text-center font-body text-charcoal/50 py-20">Classes coming soon.</p>
        )}
      </div>
    </div>
  )
}
