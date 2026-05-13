'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalClients: 0,
    totalPhotos: 0,
  })
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    const fetchStats = async () => {
      const [bookings, pending, clients, photos, recent] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact' }),
        supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('bookings').select('client_phone').then(({ data }) => {
          const unique = new Set(data?.map((b) => b.client_phone))
          return unique.size
        }),
        supabase.from('gallery_photos').select('id', { count: 'exact' }),
        supabase
          .from('bookings')
          .select('*, services(name), locations(area)')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setStats({
        totalBookings: bookings.count || 0,
        pendingBookings: pending.count || 0,
        totalClients: clients,
        totalPhotos: photos.count || 0,
      })

      if (recent.data) setRecentBookings(recent.data)
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📅', href: '/admin/bookings' },
    { label: 'Pending Confirm', value: stats.pendingBookings, icon: '⏳', href: '/admin/bookings' },
    { label: 'Unique Clients', value: stats.totalClients, icon: '👥', href: '/admin/clients' },
    { label: 'Gallery Photos', value: stats.totalPhotos, icon: '🖼️', href: '/admin/gallery' },
  ]

  const statusColor: Record<string, string> = {
    pending: '#f0a500',
    confirmed: '#25D366',
    done: 'var(--text-muted)',
    cancelled: '#e85a5a',
  }

  return (
    <div className="p-10">
      <div className="mb-10">
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-4xl font-light mb-2"
        >
          Good day, Fhulu 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Here's what's happening at Fhulu's Touch today
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {statCards.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            className="p-6 rounded-xl hover:border-[var(--accent)] transition-colors"
          >
            <div className="text-2xl mb-3">{s.icon}</div>
            <div
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              className="text-3xl font-semibold mb-1"
            >
              {s.value}
            </div>
            <div style={{ color: 'var(--text-muted)' }} className="text-xs">
              {s.label}
            </div>
          </Link>
        ))}
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
          <table className="w-full">
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
        )}
      </div>
    </div>
  )
}