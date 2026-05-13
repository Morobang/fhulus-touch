'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'done' | 'cancelled'>('all')

  const fetchBookings = async () => {
    let query = supabase
      .from('bookings')
      .select('*, services(name, price), locations(area)')
      .order('booking_date', { ascending: true })

    if (filter !== 'all') query = query.eq('status', filter)

    const { data } = await query
    if (data) setBookings(data)
    setLoading(false)
  }

  useEffect(() => { fetchBookings() }, [filter])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchBookings()
  }

  const statusColor: Record<string, string> = {
    pending: '#f0a500',
    confirmed: '#25D366',
    done: 'var(--text-muted)',
    cancelled: '#e85a5a',
  }

  return (
    <div className="p-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-4xl font-light mb-2"
          >
            Bookings
          </h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            Manage all appointments across locations
          </p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-8">
        {(['all', 'pending', 'confirmed', 'done', 'cancelled'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--surface)',
              color: filter === f ? 'var(--accent-fg)' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
            className="px-4 py-2 rounded-full text-xs capitalize transition-all"
          >
            {f}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        className="rounded-xl overflow-hidden"
      >
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
            No bookings found
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Client', 'Service', 'Location', 'Date', 'Time', 'Notes', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
                    className="px-5 py-3 text-left text-xs font-medium"
                  >
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr
                  key={b.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  className="last:border-b-0 hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                      {b.client_name}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                      {b.client_phone}
                    </div>
                    {b.client_email && (
                      <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                        {b.client_email}
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div style={{ color: 'var(--text)' }} className="text-sm">
                      {b.services?.name}
                    </div>
                    <div style={{ color: 'var(--accent)' }} className="text-xs mt-0.5">
                      R{b.services?.price}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }} className="px-5 py-4 text-sm">
                    {b.locations?.area}
                  </td>
                  <td style={{ color: 'var(--text)' }} className="px-5 py-4 text-sm">
                    {b.booking_date}
                  </td>
                  <td style={{ color: 'var(--text)' }} className="px-5 py-4 text-sm">
                    {b.booking_time?.slice(0, 5)}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }} className="px-5 py-4 text-sm max-w-32">
                    <div className="truncate">{b.notes || '—'}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      style={{
                        color: statusColor[b.status],
                        background: `${statusColor[b.status]}22`,
                        letterSpacing: '0.06em',
                      }}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {b.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(b.id, 'confirmed')}
                          style={{ background: '#25D36622', color: '#25D366', border: '1px solid #25D36644' }}
                          className="text-xs px-3 py-1 rounded-md transition-opacity hover:opacity-75"
                        >
                          Confirm
                        </button>
                      )}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => updateStatus(b.id, 'done')}
                          style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                          className="text-xs px-3 py-1 rounded-md transition-opacity hover:opacity-75"
                        >
                          Mark Done
                        </button>
                      )}
                      {b.status !== 'cancelled' && b.status !== 'done' && (
                        <button
                          onClick={() => updateStatus(b.id, 'cancelled')}
                          style={{ background: '#e85a5a22', color: '#e85a5a', border: '1px solid #e85a5a44' }}
                          className="text-xs px-3 py-1 rounded-md transition-opacity hover:opacity-75"
                        >
                          Cancel
                        </button>
                      )}
                      
                        href={`https://wa.me/${b.client_phone.replace(/\s/g, '').replace(/^0/, '27')}?text=${encodeURIComponent(`Hi ${b.client_name}, this is Fhulu confirming your ${b.services?.name} appointment on ${b.booking_date} at ${b.booking_time?.slice(0, 5)} at our ${b.locations?.area} location. See you then! 💛`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ background: '#25D36622', color: '#25D366', border: '1px solid #25D36644' }}
                        className="text-xs px-3 py-1 rounded-md transition-opacity hover:opacity-75"
                      >
                        WhatsApp
                      </a>
                    </div>
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