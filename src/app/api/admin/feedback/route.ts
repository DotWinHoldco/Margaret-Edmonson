import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('feedback_items')
      .select('*, feedback_comments(id)')
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    const items = (data || []).map((item) => ({
      ...item,
      comment_count: item.feedback_comments?.length || 0,
      feedback_comments: undefined,
    }))

    return Response.json({ data: items })
  } catch (err) {
    console.error('GET /api/admin/feedback error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!body.title?.trim()) {
      return Response.json({ error: 'Title is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('feedback_items')
      .insert({
        profile_id: user.id,
        category: body.category || 'General Feedback',
        page_or_feature: body.page_or_feature || null,
        title: body.title.trim(),
        description: body.description?.trim() || null,
        priority: body.priority || 'medium',
        status: 'new',
      })
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ data }, { status: 201 })
  } catch (err) {
    console.error('POST /api/admin/feedback error:', err)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
