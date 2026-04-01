import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100)
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-gold/20 text-gold',
  processing: 'bg-teal/20 text-teal',
  shipped: 'bg-deep-teal/20 text-deep-teal',
  delivered: 'bg-olive/20 text-olive',
  cancelled: 'bg-coral/20 text-coral',
}

export default async function AdminDashboard() {
  const supabase = await createClient()

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Fetch all data in parallel
  const [
    todayOrdersResult,
    weekOrdersResult,
    monthOrdersResult,
    recentOrdersResult,
    pendingCommissionsResult,
    activeEnrollmentsResult,
  ] = await Promise.all([
    supabase
      .from('orders')
      .select('total')
      .gte('created_at', startOfToday)
      .neq('status', 'cancelled'),
    supabase
      .from('orders')
      .select('total')
      .gte('created_at', startOfWeek)
      .neq('status', 'cancelled'),
    supabase
      .from('orders')
      .select('total')
      .gte('created_at', startOfMonth)
      .neq('status', 'cancelled'),
    supabase
      .from('orders')
      .select('id, order_number, total, status, created_at, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('commissions')
      .select('id', { count: 'exact', head: true })
      .in('status', ['pending', 'in_progress']),
    supabase
      .from('enrollments')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active'),
  ])

  const todayRevenue = (todayOrdersResult.data || []).reduce(
    (sum, order) => sum + (order.total || 0),
    0
  )
  const weekRevenue = (weekOrdersResult.data || []).reduce(
    (sum, order) => sum + (order.total || 0),
    0
  )
  const monthRevenue = (monthOrdersResult.data || []).reduce(
    (sum, order) => sum + (order.total || 0),
    0
  )

  const recentOrders = recentOrdersResult.data || []
  const pendingCommissions = pendingCommissionsResult.count || 0
  const activeEnrollments = activeEnrollmentsResult.count || 0

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-semibold text-charcoal">
          Dashboard
        </h1>
        <p className="mt-1 font-body text-charcoal/60">
          Welcome back. Here is what is happening with your store.
        </p>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-charcoal/8 p-5">
          <p className="text-sm font-body text-charcoal/50 mb-1">Today</p>
          <p className="text-2xl font-display font-semibold text-charcoal">
            {formatCurrency(todayRevenue)}
          </p>
          <p className="text-xs font-body text-charcoal/40 mt-1">
            {(todayOrdersResult.data || []).length} order{(todayOrdersResult.data || []).length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-charcoal/8 p-5">
          <p className="text-sm font-body text-charcoal/50 mb-1">This Week</p>
          <p className="text-2xl font-display font-semibold text-charcoal">
            {formatCurrency(weekRevenue)}
          </p>
          <p className="text-xs font-body text-charcoal/40 mt-1">
            {(weekOrdersResult.data || []).length} order{(weekOrdersResult.data || []).length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-charcoal/8 p-5">
          <p className="text-sm font-body text-charcoal/50 mb-1">This Month</p>
          <p className="text-2xl font-display font-semibold text-charcoal">
            {formatCurrency(monthRevenue)}
          </p>
          <p className="text-xs font-body text-charcoal/40 mt-1">
            {(monthOrdersResult.data || []).length} order{(monthOrdersResult.data || []).length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-charcoal/8 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-coral/10 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-display font-semibold text-charcoal">{pendingCommissions}</p>
            <p className="text-sm font-body text-charcoal/50">Pending Commissions</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-charcoal/8 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-olive/10 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-olive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
            </svg>
          </div>
          <div>
            <p className="text-2xl font-display font-semibold text-charcoal">{activeEnrollments}</p>
            <p className="text-sm font-body text-charcoal/50">Active Enrollments</p>
          </div>
        </div>
      </div>

      {/* Quick actions + Recent orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-charcoal/8 p-5">
          <h2 className="font-display text-lg font-semibold text-charcoal mb-4">
            Quick Actions
          </h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-teal/5 text-teal hover:bg-teal/10 transition-colors font-body text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add Product
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gold/5 text-gold hover:bg-gold/10 transition-colors font-body text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
              Create Post
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-coral/5 text-coral hover:bg-coral/10 transition-colors font-body text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
              </svg>
              View Orders
            </Link>
          </div>
        </div>

        {/* Recent orders */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-charcoal/8 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-charcoal">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm font-body text-teal hover:text-deep-teal transition-colors"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-sm font-body text-charcoal/40 py-8 text-center">
              No orders yet. They will appear here once customers start purchasing.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-charcoal/8">
                    <th className="text-left text-xs font-body font-medium text-charcoal/40 uppercase tracking-wider pb-3 pr-4">
                      Order
                    </th>
                    <th className="text-left text-xs font-body font-medium text-charcoal/40 uppercase tracking-wider pb-3 pr-4">
                      Customer
                    </th>
                    <th className="text-left text-xs font-body font-medium text-charcoal/40 uppercase tracking-wider pb-3 pr-4">
                      Status
                    </th>
                    <th className="text-right text-xs font-body font-medium text-charcoal/40 uppercase tracking-wider pb-3 pr-4">
                      Total
                    </th>
                    <th className="text-right text-xs font-body font-medium text-charcoal/40 uppercase tracking-wider pb-3">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {recentOrders.map((order: Record<string, unknown>) => {
                    const status = (order.status as OrderStatus) || 'pending'
                    const profiles = order.profiles as { full_name?: string } | null
                    return (
                      <tr key={order.id as string} className="group">
                        <td className="py-3 pr-4">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="text-sm font-body font-medium text-charcoal group-hover:text-teal transition-colors"
                          >
                            #{(order.order_number as string) || (order.id as string)?.slice(0, 8)}
                          </Link>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-sm font-body text-charcoal/70">
                            {profiles?.full_name || 'Guest'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-body font-medium capitalize ${
                              statusColors[status] || 'bg-charcoal/10 text-charcoal/60'
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <span className="text-sm font-body font-medium text-charcoal">
                            {formatCurrency((order.total as number) || 0)}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="text-sm font-body text-charcoal/50">
                            {formatDate(order.created_at as string)}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
