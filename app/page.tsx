'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Scissors, Paintbrush, Sparkles } from 'lucide-react'

interface Testimonial {
  id: string
  client_name: string
  content: string
  rating: number
}

interface Promotion {
  id: string
  title: string
  description: string
  valid_until: string
}

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number
  photo_path: string | null
}

interface GalleryPhoto {
  id: string
  storage_path: string
  category: string
  caption: string
}

function categoryMeta(cat: string) {
  switch (cat.toLowerCase()) {
    case 'braids': return { gradient: 'linear-gradient(135deg, #7B4F2E 0%, #C4902C 100%)', Icon: Scissors }
    case 'nails':  return { gradient: 'linear-gradient(135deg, #9B3D6B 0%, #D4728A 100%)', Icon: Paintbrush }
    case 'hair':   return { gradient: 'linear-gradient(135deg, #5B3D8B 0%, #9272C4 100%)', Icon: Sparkles }
    default:       return { gradient: 'linear-gradient(135deg, #4A5568 0%, #718096 100%)', Icon: Scissors }
  }
}

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const [tRes, pRes, sRes, gRes] = await Promise.all([
        supabase
          .from('testimonials')
          .select('*')
          .eq('is_approved', true)
          .order('is_featured', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('promotions')
          .select('*')
          .eq('is_active', true)
          .limit(3),
        supabase
          .from('services')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false })
          .limit(6),
        supabase
          .from('gallery_photos')
          .select('*')
          .eq('is_featured', true)
          .limit(4),
      ])

      if (tRes.data) setTestimonials(tRes.data)
      if (pRes.data) setPromotions(pRes.data)
      if (sRes.data) setServices(sRes.data)
      if (gRes.data) setGalleryPhotos(gRes.data)
    }

    fetchData()
  }, [])

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <div>
      {/* HERO */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24 relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'var(--accent)' }}
        />
        <p
          style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          className="text-xs font-medium mb-4"
        >
          POLOKWANE · MOKOPANE · LIMPOPO
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-4xl sm:text-5xl lg:text-6xl font-light leading-tight mb-6 max-w-2xl"
        >
          Where every visit<br />
          leaves you <em style={{ color: 'var(--accent)' }}>glowing</em>
        </h1>
        <p
          style={{ color: 'var(--text-muted)' }}
          className="text-sm sm:text-base max-w-md leading-relaxed mb-8 sm:mb-10"
        >
          Premium hair and nail care across Limpopo. Fhulufhelo brings
          professional salon quality to your city — book your slot today.
        </p>
        <div className="flex gap-3 flex-wrap">
          <Link
            href="/book"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            className="px-6 sm:px-8 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-85 transition-opacity"
          >
            Book Appointment
          </Link>
          <Link
            href="/gallery"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            className="px-6 sm:px-8 py-3 rounded-md text-sm hover:text-[var(--text)] transition-colors"
          >
            View Our Work
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        className="grid grid-cols-2 lg:grid-cols-4"
      >
        {[
          { num: '500+', label: 'HAPPY CLIENTS' },
          { num: '6', label: 'YEARS EXPERIENCE' },
          { num: '4.9★', label: 'AVERAGE RATING' },
          { num: '2', label: 'LOCATIONS' },
        ].map((s) => (
          <div
            key={s.label}
            style={{ borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
            className="py-6 sm:py-8 text-center last:border-r-0"
          >
            <div
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}
              className="text-3xl sm:text-4xl font-semibold"
            >
              {s.num}
            </div>
            <div
              style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
              className="text-xs mt-2"
            >
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* SERVICES TEASER */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="mb-8 sm:mb-10">
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-3xl sm:text-4xl font-light mb-3"
          >
            What We Do
          </h2>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            Hair and nails done right — every time
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => {
            const { gradient, Icon } = categoryMeta(s.category)
            return (
              <Link
                key={s.id}
                href={`/book?service=${s.id}`}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                className="rounded-2xl overflow-hidden hover:border-[var(--accent)] hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {s.photo_path ? (
                  <div className="h-56 relative overflow-hidden">
                    <Image
                      src={getPublicUrl(s.photo_path)}
                      alt={s.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={i === 0}
                    />
                    <span
                      style={{ background: 'rgba(0,0,0,0.4)', color: '#fff', backdropFilter: 'blur(4px)' }}
                      className="absolute bottom-2 left-3 text-xs px-2 py-0.5 rounded-full"
                    >
                      {s.category}
                    </span>
                  </div>
                ) : (
                  <div style={{ background: gradient }} className="h-56 flex items-center justify-center relative">
                    <Icon size={36} color="rgba(255,255,255,0.25)" />
                    <span
                      style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(4px)' }}
                      className="absolute bottom-2 left-3 text-xs px-2 py-0.5 rounded-full"
                    >
                      {s.category}
                    </span>
                  </div>
                )}
                <div className="p-4 sm:p-5 flex items-end justify-between">
                  <div>
                    <div style={{ color: 'var(--text)' }} className="font-medium text-sm mb-0.5">{s.name}</div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs">From R{s.price}</div>
                  </div>
                  <span style={{ color: 'var(--accent)' }} className="text-sm">Book →</span>
                </div>
              </Link>
            )
          })}
        </div>
        <div className="mt-6 sm:mt-8">
          <Link
            href="/services"
            style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}
            className="text-sm pb-1"
          >
            View all services & pricing →
          </Link>
        </div>
      </section>

      {/* PROMOTIONS */}
      {promotions.length > 0 && (
        <section
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
          className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
        >
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-3xl sm:text-4xl font-light mb-8 sm:mb-10"
          >
            Current Specials
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {promotions.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--accent)',
                }}
                className="p-5 sm:p-6 rounded-xl"
              >
                <div
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}
                  className="text-xl font-semibold mb-2"
                >
                  {p.title}
                </div>
                <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-3">
                  {p.description}
                </p>
                {p.valid_until && (
                  <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                    Valid until {new Date(p.valid_until).toLocaleDateString('en-ZA')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* GALLERY TEASER */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <h2
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              className="text-3xl sm:text-4xl font-light mb-2"
            >
              Recent Work
            </h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">
              Fresh off the chair
            </p>
          </div>
          <Link
            href="/gallery"
            style={{ color: 'var(--accent)', borderBottom: '1px solid var(--accent)' }}
            className="text-sm pb-1 whitespace-nowrap"
          >
            View gallery →
          </Link>
        </div>
        {galleryPhotos.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {galleryPhotos.map((g) => (
              <div
                key={g.id}
                className="aspect-square rounded-xl overflow-hidden relative cursor-pointer hover:scale-95 transition-transform"
              >
                <Image
                  src={getPublicUrl(g.storage_path)}
                  alt={g.caption || g.category}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <span
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                  className="absolute bottom-2 left-2 text-xs px-2 py-1 rounded"
                >
                  {g.caption || g.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            className="rounded-xl py-16 text-center"
          >
            <Sparkles size={32} className="mx-auto mb-3" style={{ color: 'var(--accent)' }} />
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">
              Gallery photos coming soon
            </p>
          </div>
        )}
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
          className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
        >
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-3xl sm:text-4xl font-light mb-8 sm:mb-10"
          >
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                className="p-5 sm:p-6 rounded-xl"
              >
                <div style={{ color: 'var(--accent)' }} className="text-sm mb-3">
                  {'★'.repeat(t.rating)}
                </div>
                <p
                  style={{ color: 'var(--text)' }}
                  className="text-sm leading-relaxed italic mb-4"
                >
                  "{t.content}"
                </p>
                <div
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}
                  className="text-xs font-medium"
                >
                  {t.client_name.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        style={{ background: 'var(--accent)' }}
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 text-center"
      >
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-fg)' }}
          className="text-3xl sm:text-4xl font-light mb-4"
        >
          Ready to book your appointment?
        </h2>
        <p
          style={{ color: 'var(--accent-fg)', opacity: 0.8 }}
          className="text-sm mb-6 sm:mb-8"
        >
          Available in Polokwane and Mokopane — no account needed
        </p>
        <Link
          href="/book"
          style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}
          className="px-8 sm:px-10 py-3 rounded-md text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity inline-block"
        >
          Book Now
        </Link>
      </section>
    </div>
  )
}
