import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Classes',
}

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-charcoal/10 text-charcoal/60',
  published: 'bg-teal/15 text-teal',
  archived: 'bg-coral/15 text-coral',
}

const TYPE_LABELS: Record<string, string> = {
  on_demand: 'On Demand',
  live: 'Live',
  hybrid: 'Hybrid',
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  all_levels: 'All Levels',
}

export default async function AdminClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('courses')
    .select('*, enrollments(count)')
    .order('created_at', { ascending: false })

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: courses, error } = await query

  const formatted = (courses || []).map((course) => ({
    ...course,
    enrollment_count:
      Array.isArray(course.enrollments) && course.enrollments.length > 0
        ? (course.enrollments[0] as { count: number }).count
        : 0,
  }))

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold text-charcoal">
            Classes
          </h1>
          <p className="mt-1 font-body text-sm text-charcoal/60">
            Manage your courses, modules, and lessons
          </p>
        </div>
        <Link
          href="/admin/classes/new"
          className="inline-flex items-center justify-center rounded-lg bg-teal px-5 py-2.5 font-body text-sm font-medium text-cream transition-colors hover:bg-deep-teal"
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Course
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <form className="flex gap-3" method="GET">
          <select
            name="status"
            defaultValue={status || 'all'}
            className="rounded-lg border border-charcoal/15 bg-cream px-4 py-2 font-body text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-charcoal/10 px-4 py-2 font-body text-sm font-medium text-charcoal transition-colors hover:bg-charcoal/20"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-coral/30 bg-coral/10 p-4">
          <p className="font-body text-sm text-coral">
            Failed to load courses: {error.message}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-charcoal/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/[0.03]">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Type
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Difficulty
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Price
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Enrolled
                </th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {formatted.length > 0 ? (
                formatted.map((course) => (
                  <tr
                    key={course.id}
                    className="transition-colors hover:bg-charcoal/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/classes/${course.id}`}
                        className="font-body text-sm font-medium text-charcoal hover:text-teal transition-colors"
                      >
                        {course.title}
                      </Link>
                      <p className="font-body text-xs text-charcoal/50">
                        {course.slug}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-sm text-charcoal/70">
                        {TYPE_LABELS[course.course_type] || course.course_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-sm text-charcoal/70">
                        {DIFFICULTY_LABELS[course.difficulty_level] ||
                          course.difficulty_level}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-sm font-medium text-charcoal">
                        {course.price
                          ? `$${Number(course.price).toFixed(2)}`
                          : 'Free'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 font-body text-xs font-medium capitalize ${
                          STATUS_STYLES[course.status] || STATUS_STYLES.draft
                        }`}
                      >
                        {course.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-sm text-charcoal/70">
                        {course.enrollment_count}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/classes/${course.id}`}
                        className="inline-flex items-center rounded-md px-3 py-1.5 font-body text-xs font-medium text-teal transition-colors hover:bg-teal/10"
                      >
                        <svg
                          className="mr-1 h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <svg
                      className="mx-auto h-10 w-10 text-charcoal/20"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                      />
                    </svg>
                    <p className="mt-2 font-body text-sm text-charcoal/50">
                      No courses found
                    </p>
                    <Link
                      href="/admin/classes/new"
                      className="mt-3 inline-flex items-center font-body text-sm font-medium text-teal hover:text-deep-teal"
                    >
                      Create your first course
                      <svg
                        className="ml-1 h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formatted.length > 0 && (
        <p className="mt-4 font-body text-xs text-charcoal/40">
          Showing {formatted.length} course{formatted.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
