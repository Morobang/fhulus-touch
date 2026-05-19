'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Photo {
  id: string
  storage_path: string
  category: string
  caption: string
  description: string | null
  is_featured: boolean
  service_id: string | null
  services?: { name: string; category: string } | null
}

export default function GalleryPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selected, setSelected] = useState<Photo | null>(null)

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase
        .from('gallery_photos')
        .select('*, services(name, category)')
        .order('created_at', { ascending: false })

      if (data) setPhotos(data)
      setLoading(false)
    }

    fetchPhotos()
  }, [])

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    return data.publicUrl
  }

  const effectiveCategory = (p: Photo) => p.services?.category ?? p.category
  const effectiveName = (p: Photo) => p.services?.name ?? p.caption

  // Derive unique categories from actual photos
  const categories = [
    'All',
    ...Array.from(new Set(photos.map(effectiveCategory)))
      .filter(Boolean)
      .sort(),
  ]

  const filtered = photos.filter((p) =>
    activeCategory === 'All'
      ? true
      : effectiveCategory(p).toLowerCase() === activeCategory.toLowerCase()
  )

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
          OUR WORK
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          Gallery
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          Real clients, real results — every photo is straight from the chair, no filters.
        </p>
      </section>

      {/* FILTER TABS */}
      <section className="px-4 sm:px-8 lg:px-12 pt-8 sm:pt-10 pb-4">
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'var(--accent)' : 'var(--surface)',
                color: activeCategory === cat ? 'var(--accent-fg)' : 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
              className="px-5 py-2 rounded-full text-sm transition-all hover:border-[var(--accent)]"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* GRID */}
      <section className="px-4 sm:px-8 lg:px-12 py-6 sm:py-8">
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-20">
            Loading gallery...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-20">
            No photos in this category yet — check back soon.
          </div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo)}
                className="break-inside-avoid rounded-xl overflow-hidden cursor-pointer relative group"
                style={{ border: '1px solid var(--border)' }}
              >
                <img
                  src={getPublicUrl(photo.storage_path)}
                  alt={effectiveName(photo) || effectiveCategory(photo)}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(0,0,0,0.6)' }}
                >
                  {activeCategory === 'All' && (
                    <span
                      style={{ color: '#C2185B', letterSpacing: '0.16em' }}
                      className="text-lg font-bold uppercase text-center"
                    >
                      {effectiveCategory(photo)}
                    </span>
                  )}
                  {effectiveName(photo) && (
                    <span
                      style={{ color: '#F48FB1' }}
                      className="text-sm font-semibold text-center leading-snug"
                    >
                      {effectiveName(photo)}
                    </span>
                  )}
                  {photo.description && (
                    <span
                      style={{ color: 'rgba(255,255,255,0.8)' }}
                      className="text-xs text-center leading-relaxed"
                    >
                      {photo.description}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-8"
          style={{ background: 'rgba(0,0,0,0.9)' }}
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getPublicUrl(selected.storage_path)}
              alt={effectiveName(selected) || effectiveCategory(selected)}
              className="w-full rounded-xl object-cover"
            />
            {(effectiveName(selected) || effectiveCategory(selected)) && (
              <div className="text-center mt-4">
                {effectiveCategory(selected) && (
                  <div style={{ color: '#C2185B', letterSpacing: '0.12em' }} className="text-xs font-bold uppercase mb-1">
                    {effectiveCategory(selected)}
                  </div>
                )}
                {effectiveName(selected) && (
                  <div style={{ color: '#F48FB1' }} className="text-sm font-medium">
                    {effectiveName(selected)}
                  </div>
                )}
                {selected.description && (
                  <div style={{ color: 'rgba(255,255,255,0.6)' }} className="text-xs mt-1">
                    {selected.description}
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CTA */}
      <section
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
      >
        <div>
          <div
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-2xl mb-1"
          >
            Like what you see?
          </div>
          <div style={{ color: 'var(--text-muted)' }} className="text-sm">
            Book your appointment today — no account needed
          </div>
        </div>
        <a
          href="/book"
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          className="px-8 py-3 rounded-md text-sm font-medium hover:opacity-85 transition-opacity"
        >
          Book Now
        </a>
      </section>
    </div>
  )
}
