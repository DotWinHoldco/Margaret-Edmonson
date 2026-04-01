import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import ProjectHubClient from './ProjectHubClient'

export const metadata: Metadata = {
  title: 'Project Hub',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch all initial data in parallel
  const [feedbackResult, workRequestsResult, notesResult] = await Promise.all([
    supabase
      .from('feedback_items')
      .select('*, feedback_comments(id)')
      .order('created_at', { ascending: false }),
    supabase
      .from('work_requests')
      .select('*, work_request_comments(id)')
      .order('created_at', { ascending: false }),
    supabase
      .from('project_notes')
      .select('*, project_note_comments(id)')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false }),
  ])

  const feedbackItems = (feedbackResult.data || []).map((item) => ({
    ...item,
    comment_count: item.feedback_comments?.length || 0,
    feedback_comments: undefined,
  }))

  const workRequests = (workRequestsResult.data || []).map((item) => ({
    ...item,
    comment_count: item.work_request_comments?.length || 0,
    work_request_comments: undefined,
  }))

  const notes = (notesResult.data || []).map((item) => ({
    ...item,
    comment_count: item.project_note_comments?.length || 0,
    project_note_comments: undefined,
  }))

  return (
    <ProjectHubClient
      initialFeedback={feedbackItems}
      initialWorkRequests={workRequests}
      initialNotes={notes}
    />
  )
}
