import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      cover_image_url,
      tags,
      status,
      seo_title,
      seo_description,
    } = body

    if (!title || !slug) {
      return Response.json(
        { error: 'Title and slug are required.' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    const postData: Record<string, unknown> = {
      title,
      slug,
      excerpt: excerpt || null,
      content_html: content || '',
      content_json: {},
      cover_image_url: cover_image_url || null,
      tags: tags || [],
      status: status || 'draft',
      seo_title: seo_title || null,
      seo_description: seo_description || null,
      author_id: null,
    }

    if (status === 'published') {
      postData.published_at = new Date().toISOString()
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ post: data }, { status: 201 })
  } catch {
    return Response.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
