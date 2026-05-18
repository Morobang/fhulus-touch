'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Clock, MessageCircle, Scissors, Paintbrush, Sparkles, Home, Plus } from 'lucide-react'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number
  description?: string | null
  photo_path: string | null
}

function categoryMeta(cat: string) {
  switch (cat.toLowerCase()) {
    case 'braids':
      return { gradient: 'linear-gradient(135deg, #7B4F2E 0%, #C4902C 100%)', Icon: Scissors }
    case 'nails':
      return { gradient: 'linear-gradient(135deg, #9B3D6B 0%, #D4728A 100%)', Icon: Paintbrush }
    case 'hair':
      return { gradient: 'linear-gradient(135deg, #5B3D8B 0%, #9272C4 100%)', Icon: Sparkles }
    case 'extras':
      return { gradient: 'linear-gradient(135deg, #2E6B4F 0%, #52A880 100%)', Icon: Home }
    default:
      return { gradient: 'linear-gradient(135deg, #4A5568 0%, #718096 100%)', Icon: Plus }
  }
}

function formatDuration(mins: number) {
  if (!mins || mins === 0) return null
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

const getPublicUrl = (path: string) => {
  const { data } = supabase.storage.from('gallery').getPublicUrl(path)
  return data.publicUrl
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_visible', true)
      .order('category')
      .order('price')
      .then(({ data }) => {
        if (data) setServices(data)
        setLoading(false)
      })
  }, [])

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category))).sort()]

  const filtered =
    activeTab === 'All'
      ? services
      : services.filter((s) => s.category.toLowerCase() === activeTab.toLowerCase())

  const grouped = filtered.reduce<Record<string, Service[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = []
    acc[s.category].push(s)
    return acc
  }, {})

  return (
    <div>
      {/* HEADER */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
      >
        <p style={{ color: 'var(--accent)', letterSpacing: '0.2em' }} className="text-xs mb-3">
          WHAT WE OFFER
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          Services & Pricing
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          All prices shown — no hidden costs. Tap any service to book directly.
        </p>
      </section>

      {/* STICKY CATEGORY TABS */}
      <div
        className="sticky top-0 z-20 px-4 sm:px-8 lg:px-12 py-4"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: 'none' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{
                background: activeTab === cat ? 'var(--accent)' : 'var(--surface)',
                color: activeTab === cat ? 'var(--accent-fg)' : 'var(--text-muted)',
                border: '1px solid var(--border)',
                whiteSpace: 'nowrap',
              }}
              className="px-5 py-2 rounded-full text-sm transition-all flex-shrink-0"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section className="px-4 sm:px-8 lg:px-12 py-8 sm:py-12">
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm py-20 text-center">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm py-20 text-center">
            No services listed yet.
          </div>
        ) : (
          Object.entries(grouped).map(([category, items]) => {
            const { gradient, Icon } = categoryMeta(category)
            return (
              <div key={category} className="mb-12">
                <div
                  style={{
                    color: 'var(--accent)',
                    letterSpacing: '0.16em',
                    borderBottom: '1px solid var(--border)',
                  }}
                  className="text-xs font-medium mb-6 pb-3 flex items-center gap-2"
                >
                  <Icon size={13} />
                  {category.toUpperCase()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((s, si) => (
                    <div
                      key={s.id}
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                      }}
                      className="rounded-2xl overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
                    >
                      {/* Visual top — photo or gradient fallback */}
                      {s.photo_path ? (
                        <div className="h-56 relative overflow-hidden">
                          <Image
                            src={getPublicUrl(s.photo_path)}
                            alt={s.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={si === 0}
                          />
                          <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)' }}
                          />
                          <span
                            style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(4px)' }}
                            className="absolute bottom-3 left-4 text-xs px-2 py-1 rounded-full tracking-wide"
                          >
                            {category}
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{ background: gradient }}
                          className="h-56 flex items-center justify-center relative"
                        >
                          <Icon size={44} color="rgba(255,255,255,0.25)" />
                          <div
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.25) 100%)' }}
                          />
                          <span
                            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)' }}
                            className="absolute bottom-3 left-4 text-xs px-2 py-1 rounded-full tracking-wide"
                          >
                            {category}
                          </span>
                        </div>
                      )}

                      {/* Details */}
                      <div className="p-5 flex flex-col flex-1">
                        <div style={{ color: 'var(--text)' }} className="font-medium text-base mb-1 leading-snug">
                          {s.name}
                        </div>
                        {s.description && (
                          <div style={{ color: 'var(--text-muted)' }} className="text-xs leading-relaxed mb-2">
                            {s.description}
                          </div>
                        )}

                        <div className="flex items-end justify-between mt-auto pt-4">
                          <div>
                            <div
                              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                              className="text-2xl font-semibold leading-none"
                            >
                              R{s.price}
                            </div>
                            {formatDuration(s.duration_min) && (
                              <div
                                style={{ color: 'var(--text-muted)' }}
                                className="text-xs flex items-center gap-1 mt-1"
                              >
                                <Clock size={11} />
                                {formatDuration(s.duration_min)}
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/book?service=${s.id}`}
                            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-85 transition-opacity"
                          >
                            Book →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </section>

      {/* CTA */}
      <section
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
      >
        <div>
          <div
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-2xl font-light mb-1"
          >
            Not sure what to book?
          </div>
          <div style={{ color: 'var(--text-muted)' }} className="text-sm">
            WhatsApp Fhulu and she'll advise you
          </div>
        </div>
        <a
          href="https://wa.me/27769068341"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: '#25D366', color: '#fff' }}
          className="px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <MessageCircle size={16} />
          WhatsApp Fhulu
        </a>
      </section>
    </div>
  )
}
