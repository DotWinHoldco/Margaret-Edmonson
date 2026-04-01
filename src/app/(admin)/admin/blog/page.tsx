import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog Posts',
}

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, title, slug, status, published_at, tags, created_at')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    draft: 'bg-charcoal/10 text-charcoal/60',
    published: 'bg-teal/15 text-teal',
    archived: 'bg-coral/15 text-coral',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-light text-charcoal">
          Blog Posts
        </h1>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 rounded-sm bg-teal px-4 py-2 font-body text-sm font-medium text-cream transition-colors hover:bg-deep-teal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Post
        </Link>
      </div>

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b border-charcoal/10 bg-charcoal/[0.02]">
              <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                Title
              </th>
              <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                Status
              </th>
              <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                Published Date
              </th>
              <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                Tags
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-charcoal/[0.02]"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/blog/${post.id}`}
                      className="font-body text-sm font-medium text-charcoal hover:text-teal transition-colors"
                    >
                      {post.title}
                    </Link>
                    <p className="font-body text-xs text-charcoal/40 mt-0.5">
                      /{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-sm px-2 py-0.5 font-body text-xs font-medium ${statusColor[post.status] || statusColor.draft}`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-body text-sm text-charcoal/60">
                    {post.published_at
                      ? new Date(post.published_at).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          }
                        )
                      : '--'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-sm bg-charcoal/5 px-2 py-0.5 font-body text-xs text-charcoal/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-12 text-center font-body text-sm text-charcoal/40"
                >
                  No blog posts yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
