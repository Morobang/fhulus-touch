'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface BeforeAfter {
  id: string
  before_path: string
  after_path: string
  service_type: string
  caption: string
}

export default function BeforeAfterPage() {
  const [items, setItems] = useState<BeforeAfter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('before_after')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setItems(data)
      setLoading(false)
    }
    fetch()
  }, [])

  const getUrl = (path: string) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    return data.publicUrl
  }

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
          TRANSFORMATIONS
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-5xl font-light mb-4"
        >
          Before & After
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          Real transformations from real clients. See what a single appointment can do.
        </p>
      </section>

      {/* GRID */}
      <section className="px-4 sm:px-8 lg:px-12 py-8 sm:py-12 lg:py-16">
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-20">
            Loading transformations...
          </div>
        ) : items.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-20">
            Before & after photos coming soon — check back after our next appointments.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                className="rounded-2xl overflow-hidden"
              >
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img
                      src={getUrl(item.before_path)}
                      alt="Before"
                      className="w-full aspect-square object-cover"
                    />
                    <div
                      style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', letterSpacing: '0.1em' }}
                      className="absolute top-3 left-3 text-xs px-2 py-1 rounded"
                    >
                      BEFORE
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={getUrl(item.after_path)}
                      alt="After"
                      className="w-full aspect-square object-cover"
                    />
                    <div
                      style={{ background: 'var(--accent)', color: 'var(--accent-fg)', letterSpacing: '0.1em' }}
                      className="absolute top-3 left-3 text-xs px-2 py-1 rounded"
                    >
                      AFTER
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4">
                  {item.service_type && (
                    <div
                      style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
                      className="text-xs mb-1"
                    >
                      {item.service_type.toUpperCase()}
                    </div>
                  )}
                  {item.caption && (
                    <div style={{ color: 'var(--text-muted)' }} className="text-sm">
                      {item.caption}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section
        style={{ background: 'var(--accent)' }}
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 text-center"
      >
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-fg)' }}
          className="text-2xl sm:text-3xl lg:text-4xl font-light mb-4"
        >
          Want your own transformation?
        </h2>
        <a
          href="/book"
          style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}
          className="inline-block px-10 py-3 rounded-md text-sm font-semibold mt-2 hover:opacity-90 transition-opacity"
        >
          Book Now
        </a>
      </section>
    </div>
  )
}