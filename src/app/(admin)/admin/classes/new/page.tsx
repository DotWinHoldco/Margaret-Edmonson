import Link from 'next/link'
import CourseForm from '@/components/admin/classes/CourseForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'New Course',
}

export default function NewCoursePage() {
  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Link
          href="/admin/classes"
          className="flex items-center font-body text-sm text-charcoal/60 transition-colors hover:text-charcoal"
        >
          <svg
            className="mr-1 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Classes
        </Link>
      </div>

      <h1 className="mb-8 font-display text-3xl font-semibold text-charcoal">
        New Course
      </h1>

      <CourseForm mode="create" />
    </div>
  )
}
