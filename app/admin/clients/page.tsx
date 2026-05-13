'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Client {
  client_name: string
  client_phone: string
  client_email: string
  visit_count: number
  last_visit: string
  last_service: string
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('client_name, client_phone, client_email, booking_date, services(name)')
        .eq('status', 'done')
        .order('booking_date', { ascending: false })

      if (data) {
        const map: Record<string, Client> = {}

        data.forEach((b: any) => {
          const key = b.client_phone
          if (!map[key]) {
            map[key] = {
              client_name: b.client_name,
              client_phone: b.client_phone,
              client_email: b.client_email || '',
              visit_count: 0,
              last_visit: b.booking_date,
              last_service: b.services?.name || '',
            }
          }
          map[key].visit_count += 1
        })

        setClients(Object.values(map).sort((a, b) => b.visit_count - a.visit_count))
      }

      setLoading(false)
    }

    fetchClients()
  }, [])

  const filtered = clients.filter(
    (c) =>
      c.client_name.toLowerCase().includes(search.toLowerCase()) ||
      c.client_phone.includes(search)
  )

  return (
    <div className="p-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-4xl font-light mb-2"
          >
            Clients
          </h1>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            Everyone who has completed an appointment
          </p>
        </div>
        <input
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            width: '240px',
          }}
          className="px-4 py-2 rounded-lg text-sm outline-none"
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        className="rounded-xl overflow-hidden"
      >
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
            Loading clients...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
            {search ? 'No clients match your search' : 'No completed appointments yet'}
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Client', 'Phone', 'Email', 'Visits', 'Last Visit', 'Last Service', 'Actions'].map((h) => (
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
              {filtered.map((c) => (
                <tr
                  key={c.client_phone}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  className="last:border-b-0 hover:bg-[var(--bg)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                      {c.client_name}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }} className="px-6 py-4 text-sm">
                    {c.client_phone}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }} className="px-6 py-4 text-sm">
                    {c.client_email || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div
                      style={{
                        background: 'var(--accent)',
                        color: 'var(--accent-fg)',
                        display: 'inline-block',
                      }}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {c.visit_count} {c.visit_count === 1 ? 'visit' : 'visits'}
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }} className="px-6 py-4 text-sm">
                    {c.last_visit}
                  </td>
                  <td style={{ color: 'var(--text-muted)' }} className="px-6 py-4 text-sm">
                    {c.last_service}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://wa.me/${c.client_phone.replace(/\s/g, '').replace(/^0/, '27')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: '#25D36622', color: '#25D366', border: '1px solid #25D36644' }}
                      className="text-xs px-3 py-1.5 rounded-md"
                    >
                      WhatsApp
                    </a>
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