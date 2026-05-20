'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number
  description: string | null
}

export default function PricesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_visible', true)
      .order('category')
      .order('name')
      .then(({ data }) => {
        if (data) setServices(data)
        setLoading(false)
      })
  }, [])

  const formatDuration = (mins: number) => {
    if (!mins) return null
    if (mins < 60) return `${mins} min`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }

  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    const cat = s.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div>
      {/* HEADER */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
      >
        <p
          style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          className="text-xs mb-3"
        >
          PRICING
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          Price List
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          All prices listed below. Some services may vary based on hair length and complexity —
          WhatsApp Fhulu for a custom quote.
        </p>
      </section>

      {/* PRICE LIST */}
      <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14 max-w-2xl">
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
            Loading prices...
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <div
                  style={{ color: 'var(--accent)', letterSpacing: '0.14em', borderBottom: '1px solid var(--border)' }}
                  className="text-xs font-semibold pb-3 mb-0"
                >
                  {category.toUpperCase()}
                </div>
                <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
                  {items.map((s, i) => (
                    <div
                      key={s.id}
                      style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined, background: 'var(--surface)' }}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                          {s.name}
                        </div>
                        {s.description && (
                          <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                            {s.description}
                          </div>
                        )}
                        {formatDuration(s.duration_min) && (
                          <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                            ⏱ {formatDuration(s.duration_min)}
                          </div>
                        )}
                      </div>
                      <div
                        style={{ color: 'var(--accent)', fontFamily: 'var(--font-serif)', flexShrink: 0 }}
                        className="text-base font-semibold"
                      >
                        R{s.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Note + CTA */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="mt-10 p-6 rounded-xl"
        >
          <div style={{ color: 'var(--text)' }} className="text-sm font-medium mb-2">
            Prices may vary
          </div>
          <p style={{ color: 'var(--text-muted)' }} className="text-xs leading-relaxed mb-4">
            Prices are a guide. Final cost depends on hair length, thickness, and complexity.
            WhatsApp Fhulu for a personalised quote before booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="/book"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-center"
            >
              Book Now
            </a>
            <a
              href={`whatsapp://send?phone=27769068341&text=${encodeURIComponent("Hi Fhulu! 👋 I'd like a quote for a service.")}`}
              style={{ background: '#25D366', color: '#fff' }}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-center"
            >
              WhatsApp for Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
