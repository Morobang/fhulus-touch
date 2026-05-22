'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Calendar, Clock, Users, Image, TrendingUp, Star, Eye } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    bookingsThisWeek: 0,
    revenueThisMonth: 0,
    totalClients: 0,
    totalPhotos: 0,
    pendingReviews: 0,
    visitsToday: 0,
    visitsThisMonth: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const now = new Date()

      // Week: Monday → today
      const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - dayOfWeek)
      const weekStartStr = weekStart.toISOString().slice(0, 10)

      // Month: 1st of current month → today
      const monthStartStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

      const todayStr = now.toISOString().slice(0, 10)

      const [bookings, pending, weekBookings, clients, photos, pendingReviews, monthBookings, recent, visitsToday, visitsMonth] =
        await Promise.all([
          supabase.from('bookings').select('id', { count: 'exact' }),
          supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'pending'),
          supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .gte('booking_date', weekStartStr)
            .not('status', 'eq', 'cancelled'),
          supabase.from('bookings').select('client_phone').then(({ data }) => {
            const unique = new Set(data?.map((b) => b.client_phone))
            return unique.size
          }),
          supabase.from('gallery_photos').select('id', { count: 'exact' }),
          supabase.from('testimonials').select('id', { count: 'exact' }).eq('is_approved', false),
          supabase
            .from('bookings')
            .select('services(price)')
            .gte('booking_date', monthStartStr)
            .not('status', 'eq', 'cancelled'),
          supabase
            .from('bookings')
            .select('*, services(name, price), locations(area)')
            .order('created_at', { ascending: false })
            .limit(5),
          supabase.from('page_views').select('id', { count: 'exact' }).gte('created_at', `${todayStr}T00:00:00`),
          supabase.from('page_views').select('id', { count: 'exact' }).gte('created_at', `${monthStartStr}T00:00:00`),
        ])

      const revenue = (monthBookings.data ?? []).reduce(
        (sum: number, b: any) => sum + (b.services?.price ?? 0),
        0,
      )

      setStats({
        totalBookings: bookings.count || 0,
        pendingBookings: pending.count || 0,
        bookingsThisWeek: weekBookings.count || 0,
        revenueThisMonth: revenue,
        totalClients: clients,
        totalPhotos: photos.count || 0,
        pendingReviews: pendingReviews.count || 0,
        visitsToday: visitsToday.count || 0,
        visitsThisMonth: visitsMonth.count || 0,
      })

      if (recent.data) setRecentBookings(recent.data)
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Pending Confirm', value: stats.pendingBookings, icon: Clock, href: '/admin/bookings', highlight: stats.pendingBookings > 0 },
    { label: 'This Week', value: stats.bookingsThisWeek, icon: Calendar, href: '/admin/bookings', highlight: false },
    { label: 'Revenue This Month', value: `R${stats.revenueThisMonth.toLocaleString()}`, icon: TrendingUp, href: '/admin/bookings', highlight: false },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Star, href: '/admin/testimonials', highlight: stats.pendingReviews > 0 },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Calendar, href: '/admin/bookings', highlight: false },
    { label: 'Unique Clients', value: stats.totalClients, icon: Users, href: '/admin/clients', highlight: false },
    { label: 'Gallery Photos', value: stats.totalPhotos, icon: Image, href: '/admin/gallery', highlight: false },
    { label: 'Visits Today', value: stats.visitsToday, icon: Eye, href: '#', highlight: false },
    { label: 'Visits This Month', value: stats.visitsThisMonth, icon: Eye, href: '#', highlight: false },
  ]

  const statusColor: Record<string, string> = {
    pending: '#f0a500',
    confirmed: '#25D366',
    done: 'var(--text-muted)',
    cancelled: '#e85a5a',
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8">
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-4xl font-light mb-2"
        >
          Good day, Fhulu
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Here's what's happening at Fhulu's Touch today
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
        {statCards.map((s) => {
          const Icon = s.icon
          return (
            <Link
              key={s.label}
              href={s.href}
              style={{
                background: s.highlight ? 'rgba(var(--accent-rgb, 194,24,91), 0.06)' : 'var(--surface)',
                border: s.highlight ? '1px solid var(--accent)' : '1px solid var(--border)',
              }}
              className="p-5 rounded-xl hover:border-[var(--accent)] transition-colors"
            >
              <div className="mb-3" style={{ color: 'var(--accent)' }}><Icon size={18} /></div>
              <div
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                className="text-2xl font-semibold mb-1"
              >
                {s.value}
              </div>
              <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                {s.label}
              </div>
            </Link>
          )
        })}
      </div>

      {/* RECENT BOOKINGS */}
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        className="rounded-xl overflow-hidden"
      >
        <div
          style={{ borderBottom: '1px solid var(--border)' }}
          className="px-6 py-4 flex justify-between items-center"
        >
          <div style={{ color: 'var(--text)' }} className="font-medium">
            Recent Bookings
          </div>
          <Link
            href="/admin/bookings"
            style={{ color: 'var(--accent)' }}
            className="text-xs"
          >
            View all →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div
            style={{ color: 'var(--text-muted)' }}
            className="px-6 py-12 text-sm text-center"
          >
            No bookings yet
          </div>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Client', 'Service', 'Location', 'Date', 'Time', 'Status'].map((h) => (
                  <th
                    key={h}
                    style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
                    className="px-6 py-3 text-left text-xs font-medium"
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  className="last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                      {b.client_name}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                      {b.client_phone}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text)' }} className="px-6 py-4 text-sm">
                    {b.services?.name}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }} className="px-6 py-4 text-sm">
                    {b.locations?.area}
                  </td>
                  <td style={{ color: 'var(--text)' }} className="px-6 py-4 text-sm">
                    {b.booking_date}
                  </td>
                  <td style={{ color: 'var(--text)' }} className="px-6 py-4 text-sm">
                    {b.booking_time?.slice(0, 5)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      style={{
                        color: statusColor[b.status] || 'var(--text-muted)',
                        background: `${statusColor[b.status]}22`,
                        letterSpacing: '0.06em',
                      }}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  )
}