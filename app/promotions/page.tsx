'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Gift, MessageCircle } from 'lucide-react'

interface Promotion {
  id: string
  title: string
  description: string
  discount_percent: number
  valid_until: string
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      if (data) setPromotions(data)
      setLoading(false)
    }
    fetch()
  }, [])

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
          CURRENT DEALS
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          Specials & Promotions
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          Check here regularly — Fhulu runs new specials all the time.
        </p>
      </section>

      {/* PROMOTIONS */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-20">
            Loading specials...
          </div>
        ) : promotions.length === 0 ? (
          <div
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            className="rounded-xl p-16 text-center"
          >
            <Gift size={40} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
            <div
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              className="text-2xl mb-2"
            >
              No active specials right now
            </div>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-6">
              Follow Fhulu on WhatsApp or Instagram to be the first to know about new deals.
            </p>
            <a
              href="https://wa.me/27769068341"
              style={{ background: '#25D366', color: '#fff' }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium"
            >
              <MessageCircle size={16} /> Follow on WhatsApp
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {promotions.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--accent)',
                }}
                className="p-8 rounded-2xl"
              >
                {p.discount_percent && (
                  <div
                    style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                    className="inline-block text-sm px-4 py-1 rounded-full font-semibold mb-4"
                  >
                    {p.discount_percent}% OFF
                  </div>
                )}
                <div
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                  className="text-2xl mb-3"
                >
                  {p.title}
                </div>
                {p.description && (
                  <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-4">
                    {p.description}
                  </p>
                )}
                {p.valid_until && (
                  <div style={{ color: 'var(--text-muted)' }} className="text-xs mb-6">
                    Valid until {new Date(p.valid_until).toLocaleDateString('en-ZA')}
                  </div>
                )}
                <a
                  href="/book"
                  style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                  className="inline-block px-6 py-2 rounded-md text-sm font-medium hover:opacity-85 transition-opacity"
                >
                  Book Now
                </a>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}