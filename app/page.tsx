'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [promotions, setPromotions] = useState<Promotion[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: tData } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .eq('is_approved', true)
        .limit(4)

      const { data: pData } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .limit(3)

      if (tData) setTestimonials(tData)
      if (pData) setPromotions(pData)
    }

    fetchData()
  }, [])

  return (
    <div>
      {/* HERO */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-12 py-24 relative overflow-hidden"
      >
        <div
          className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
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
          className="text-6xl font-light leading-tight mb-6 max-w-2xl"
        >
          Where every visit<br />
          leaves you <em style={{ color: 'var(--accent)' }}>glowing</em>
        </h1>
        <p
          style={{ color: 'var(--text-muted)' }}
          className="text-base max-w-md leading-relaxed mb-10"
        >
          Premium hair and nail care across Limpopo. Fhulufhelo brings
          professional salon quality to your city — book your slot today.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Link
            href="/book"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            className="px-8 py-3 rounded-md text-sm font-medium tracking-wide hover:opacity-85 transition-opacity"
          >
            Book Appointment
          </Link>
          <Link
            href="/gallery"
            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            className="px-8 py-3 rounded-md text-sm hover:text-[var(--text)] transition-colors"
          >
            View Our Work
          </Link>
        </div>
      </section>

      {/* STATS */}
      <section
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        className="grid grid-cols-4"
      >
        {[
          { num: '500+', label: 'HAPPY CLIENTS' },
          { num: '6', label: 'YEARS EXPERIENCE' },
          { num: '4.9★', label: 'AVERAGE RATING' },
          { num: '2', label: 'LOCATIONS' },
        ].map((s) => (
          <div
            key={s.label}
            style={{ borderRight: '1px solid var(--border)' }}
            className="py-8 text-center last:border-r-0"
          >
            <div
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}
              className="text-4xl font-semibold"
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
      <section className="px-12 py-16">
        <div className="mb-10">
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-4xl font-light mb-3"
          >
            What We Do
          </h2>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm">
            Hair and nails done right — every time
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: 'Knotless Braids', cat: 'Hair', price: 'From R450', emoji: '💆‍♀️' },
            { title: 'Gel Nails', cat: 'Nails', price: 'From R280', emoji: '💅' },
            { title: 'Locs Retwist', cat: 'Hair', price: 'From R200', emoji: '✨' },
            { title: 'Silk Press', cat: 'Hair', price: 'From R350', emoji: '🌟' },
            { title: 'Nail Art', cat: 'Nails', price: 'From R15/nail', emoji: '🎨' },
            { title: 'Colour & Highlights', cat: 'Hair', price: 'From R600', emoji: '🌈' },
          ].map((s) => (
            <div
              key={s.title}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
              className="p-6 rounded-xl hover:border-[var(--accent)] transition-colors cursor-pointer"
            >
              <div className="text-2xl mb-3">{s.emoji}</div>
              <div
                style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.12em' }}
                className="font-medium mb-1"
              >
                {s.cat.toUpperCase()}
              </div>
              <div style={{ color: 'var(--text)' }} className="font-medium mb-1">
                {s.title}
              </div>
              <div style={{ color: 'var(--text-muted)' }} className="text-sm">
                {s.price}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8">
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
          className="px-12 py-16"
        >
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-4xl font-light mb-10"
          >
            Current Specials
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {promotions.map((p) => (
              <div
                key={p.id}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--accent)',
                }}
                className="p-6 rounded-xl"
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
      <section className="px-12 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              className="text-4xl font-light mb-2"
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
            className="text-sm pb-1"
          >
            View full gallery →
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Knotless Braids', bg: 'linear-gradient(135deg,#c9a84c33,#e8d5a3)' },
            { label: 'Gel Nails', bg: 'linear-gradient(135deg,#ddd0ee,#b8a0d8)' },
            { label: 'Silk Press', bg: 'linear-gradient(135deg,#e0eae8,#a4c4c0)' },
            { label: 'Nail Art', bg: 'linear-gradient(135deg,#ffd0c0,#ffb090)' },
          ].map((g) => (
            <div
              key={g.label}
              style={{ background: g.bg }}
              className="aspect-square rounded-xl flex items-end p-3 cursor-pointer hover:scale-95 transition-transform"
            >
              <span
                style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
                className="text-xs px-2 py-1 rounded"
              >
                {g.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section
          style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
          className="px-12 py-16"
        >
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-4xl font-light mb-10"
          >
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                className="p-6 rounded-xl"
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
        className="px-12 py-16 text-center"
      >
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-fg)' }}
          className="text-4xl font-light mb-4"
        >
          Ready to book your appointment?
        </h2>
        <p
          style={{ color: 'var(--accent-fg)', opacity: 0.8 }}
          className="text-sm mb-8"
        >
          Available in Polokwane and Mokopane — no account needed
        </p>
        <Link
          href="/book"
          style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}
          className="px-10 py-3 rounded-md text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity inline-block"
        >
          Book Now
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        className="px-12 py-10 flex justify-between items-center"
      >
        <div>
          <div
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}
            className="text-lg font-semibold mb-1"
          >
            Fhulu's Touch
          </div>
          <div style={{ color: 'var(--text-muted)' }} className="text-xs">
            Hair & Nails · Polokwane & Mokopane
          </div>
        </div>
        <div className="flex gap-6">
          {['Services', 'Gallery', 'About', 'Contact', 'Book'].map((l) => (
            <Link
              key={l}
              href={`/${l.toLowerCase()}`}
              style={{ color: 'var(--text-muted)' }}
              className="text-xs hover:text-[var(--text)] transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>
        <div style={{ color: 'var(--text-muted)' }} className="text-xs text-right">
          <div>076 906 8341</div>
          <div className="mt-1">fhulufhelomarubini36@gmail.com</div>
        </div>
      </footer>
    </div>
  )
}