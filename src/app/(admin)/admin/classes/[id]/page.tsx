import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseForm from '@/components/admin/classes/CourseForm'
import ModuleLessonManager from '@/components/admin/classes/ModuleLessonManager'
import type { Metadata } from 'next'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await props.params
  const supabase = await createClient()
  const { data } = await supabase
    .from('courses')
    .select('title')
    .eq('id', id)
    .single()

  return {
    title: data?.title ? `Edit: ${data.title}` : 'Course Not Found',
  }
}

export default async function CourseDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const { id } = await props.params
  const supabase = await createClient()

  // Fetch course, modules with lessons, and enrollment stats in parallel
  const [courseResult, modulesResult, enrollmentResult] = await Promise.all([
    supabase.from('courses').select('*').eq('id', id).single(),
    supabase
      .from('course_modules')
      .select('*, lessons(*)')
      .eq('course_id', id)
      .order('sort_order', { ascending: true }),
    supabase.from('enrollments').select('status').eq('course_id', id),
  ])

  if (courseResult.error || !courseResult.data) {
    notFound()
  }

  const course = courseResult.data

  // Sort lessons within each module
  const modules = (modulesResult.data || []).map((mod) => ({
    ...mod,
    lessons: Array.isArray(mod.lessons)
      ? [...mod.lessons].sort(
          (a: { sort_order: number }, b: { sort_order: number }) =>
            (a.sort_order || 0) - (b.sort_order || 0)
        )
      : [],
  }))

  const enrollments = enrollmentResult.data || []
  const enrollmentStats = {
    total: enrollments.length,
    active: enrollments.filter((e) => e.status === 'active').length,
    completed: enrollments.filter((e) => e.status === 'completed').length,
  }

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
        {course.title}
      </h1>

      {/* Course Edit Form */}
      <div className="mb-10">
        <CourseForm course={course} mode="edit" />
      </div>

      {/* Module/Lesson Manager and Enrollment Stats */}
      <ModuleLessonManager
        courseId={id}
        modules={modules}
        enrollmentStats={enrollmentStats}
      />
    </div>
  )
}
