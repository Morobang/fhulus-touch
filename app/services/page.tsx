'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'All' | 'Hair' | 'Nails'>('All')

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_visible', true)
        .order('category')

      if (data) setServices(data)
      setLoading(false)
    }

    fetchServices()
  }, [])

  const filtered = services.filter((s) =>
    activeTab === 'All' ? true : s.category.toLowerCase() === activeTab.toLowerCase()
  )

  const hair = filtered.filter((s) => s.category.toLowerCase() === 'hair')
  const nails = filtered.filter((s) => s.category.toLowerCase() === 'nails')

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }

  const ServiceRow = ({ service }: { service: Service }) => (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
      }}
      className="flex items-center justify-between px-6 py-5 rounded-xl mb-2 hover:border-[var(--accent)] transition-colors group"
    >
      <div>
        <div style={{ color: 'var(--text)' }} className="font-medium mb-1">
          {service.name}
        </div>
        <div style={{ color: 'var(--text-muted)' }} className="text-xs">
          ⏱ {formatDuration(service.duration_min)}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-2xl font-semibold"
        >
          R{service.price}
        </div>
        <Link
          href={`/book?service=${service.id}`}
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          className="px-4 py-2 rounded-md text-xs font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Book
        </Link>
      </div>
    </div>
  )

  return (
    <div>
      {/* HEADER */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-12 py-16"
      >
        <p
          style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          className="text-xs mb-3"
        >
          WHAT WE OFFER
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-5xl font-light mb-4"
        >
          Services & Pricing
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          All prices are final — no hidden costs. Hover any service and tap Book to go straight to the booking form.
        </p>
      </section>

      {/* TABS */}
      <section className="px-12 pt-10 pb-2">
        <div className="flex gap-2">
          {(['All', 'Hair', 'Nails'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'var(--accent)' : 'var(--surface)',
                color: activeTab === tab ? 'var(--accent-fg)' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
              className="px-5 py-2 rounded-full text-sm transition-all"
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="px-12 py-8">
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm py-12 text-center">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm py-12 text-center">
            No services listed yet — check back soon.
          </div>
        ) : (
          <>
            {(activeTab === 'All' || activeTab === 'Hair') && hair.length > 0 && (
              <div className="mb-10">
                <div
                  style={{
                    color: 'var(--accent)',
                    letterSpacing: '0.16em',
                    borderBottom: '1px solid var(--border)',
                  }}
                  className="text-xs font-medium mb-4 pb-3"
                >
                  HAIR SERVICES
                </div>
                {hair.map((s) => <ServiceRow key={s.id} service={s} />)}
              </div>
            )}

            {(activeTab === 'All' || activeTab === 'Nails') && nails.length > 0 && (
              <div className="mb-10">
                <div
                  style={{
                    color: 'var(--accent)',
                    letterSpacing: '0.16em',
                    borderBottom: '1px solid var(--border)',
                  }}
                  className="text-xs font-medium mb-4 pb-3"
                >
                  NAIL SERVICES
                </div>
                {nails.map((s) => <ServiceRow key={s.id} service={s} />)}
              </div>
            )}
          </>
        )}
      </section>

      {/* SEED NOTE */}
      <section
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        className="px-12 py-10 flex items-center justify-between"
      >
        <div>
          <div
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-xl mb-1"
          >
            Not sure what you need?
          </div>
          <div style={{ color: 'var(--text-muted)' }} className="text-sm">
            WhatsApp Fhulu directly and she'll advise you
          </div>
        </div>
        <a
          href="https://wa.me/27769068341"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: '#25D366', color: '#fff' }}
          className="px-6 py-3 rounded-md text-sm font-medium flex items-center gap-2 hover:opacity-88 transition-opacity"
        >
          💬 WhatsApp Fhulu
        </a>
      </section>
    </div>
  )
}