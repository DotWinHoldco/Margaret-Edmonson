import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pages',
}

export default async function AdminPagesPage() {
  const supabase = await createServiceClient()
  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, title, slug, updated_at')
    .order('updated_at', { ascending: false })

  const defaultSlugs = ['about', 'privacy', 'terms', 'shipping-policy']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-charcoal">
            Pages
          </h1>
          <p className="mt-1 font-body text-sm text-charcoal/60">
            Manage your site pages and content
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 rounded-sm bg-teal px-4 py-2 font-body text-sm font-medium text-cream transition-colors hover:bg-deep-teal"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Page
        </Link>
      </div>

      {error && (
        <div className="rounded-sm border border-coral/30 bg-coral/10 p-4">
          <p className="font-body text-sm text-coral">
            Failed to load pages: {error.message}
          </p>
        </div>
      )}

      <div className="overflow-hidden rounded-sm border border-charcoal/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-charcoal/10 bg-charcoal/[0.03]">
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Title
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Slug
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Last Updated
                </th>
                <th className="px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Type
                </th>
                <th className="px-4 py-3 text-right font-body text-xs font-semibold uppercase tracking-wider text-charcoal/50">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/5">
              {pages && pages.length > 0 ? (
                pages.map((page) => (
                  <tr
                    key={page.id}
                    className="transition-colors hover:bg-charcoal/[0.02]"
                  >
                    <td className="px-4 py-3">
                      <span className="font-body text-sm font-medium text-charcoal">
                        {page.title}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-body text-sm text-charcoal/60">
                        /{page.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-body text-sm text-charcoal/60">
                      {page.updated_at
                        ? new Date(page.updated_at).toLocaleDateString(
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
                      {defaultSlugs.includes(page.slug) ? (
                        <span className="inline-flex rounded-sm bg-charcoal/5 px-2 py-0.5 font-body text-xs text-charcoal/50">
                          Default
                        </span>
                      ) : (
                        <span className="inline-flex rounded-sm bg-teal/10 px-2 py-0.5 font-body text-xs text-teal">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/pages/${page.id}`}
                        className="inline-flex items-center rounded-md px-3 py-1.5 font-body text-xs font-medium text-teal transition-colors hover:bg-teal/10"
                      >
                        <svg
                          className="mr-1 h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center font-body text-sm text-charcoal/40"
                  >
                    No pages yet. Create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pages && pages.length > 0 && (
        <p className="font-body text-xs text-charcoal/40">
          Showing {pages.length} page{pages.length !== 1 ? 's' : ''}
        </p>
      )}
    </div>
  )
}
