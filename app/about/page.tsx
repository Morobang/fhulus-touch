'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sparkles, Heart, MapPin, UserCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AboutPage() {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null)

  useEffect(() => {
    // Try each common extension to find the uploaded photo
    const exts = ['jpg', 'jpeg', 'png', 'webp']
    const tryNext = async (i: number) => {
      if (i >= exts.length) return
      const { data } = supabase.storage.from('gallery').getPublicUrl(`profile/owner.${exts[i]}`)
      const r = await fetch(data.publicUrl, { method: 'HEAD' }).catch(() => null)
      if (r?.ok) setProfilePhoto(data.publicUrl)
      else tryNext(i + 1)
    }
    tryNext(0)
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
          OUR STORY
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          About Fhulu's Touch
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          Born in Limpopo, built with love — here's the story behind the salon.
        </p>
      </section>

      {/* STORY */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-2xl sm:text-3xl font-light mb-6"
          >
            Meet Fhulufhelo
          </h2>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-4">
            Fhulufhelo Ramathuthu is a professional hair and nail artist based across
            Limpopo, with locations in Polokwane and Mokopane. With over 6 years of
            hands-on experience, she has built a reputation for precision, creativity,
            and making every client feel at home.
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-4">
            What started as a passion for doing her friends' hair grew into a full
            professional practice. Today Fhulu serves hundreds of clients across
            the region — from protective styles and locs to nail art and gel sets.
          </p>
          <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed">
            Every appointment is personal. She takes the time to understand your
            hair type, your lifestyle, and your vision before touching a single
            strand — because great hair starts with a great conversation.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              aspectRatio: '4/5',
            }}
            className="rounded-2xl overflow-hidden flex items-center justify-center relative"
          >
            {profilePhoto ? (
              <Image
                src={profilePhoto}
                alt="Fhulufhelo Ramathuthu"
                fill
                className="object-cover"
              />
            ) : (
              <div className="text-center">
                <UserCircle size={56} style={{ color: 'var(--text-muted)' }} className="mb-3" />
                <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                  Photo coming soon
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
      >
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-2xl sm:text-3xl font-light mb-8 sm:mb-10 text-center"
        >
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              icon: Sparkles,
              title: 'Quality First',
              desc: 'We never rush. Every service is done with full attention — from prep to finish.',
            },
            {
              icon: Heart,
              title: 'You Feel Seen',
              desc: 'Your hair type, your lifestyle, your preferences — we listen before we start.',
            },
            {
              icon: MapPin,
              title: 'Close to You',
              desc: 'Multiple locations across Limpopo so quality salon care is always nearby.',
            },
          ].map((v) => {
            const Icon = v.icon
            return (
              <div
                key={v.title}
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                className="p-6 sm:p-8 rounded-xl text-center"
              >
                <div className="mb-4 flex justify-center" style={{ color: 'var(--accent)' }}>
                  <Icon size={28} />
                </div>
                <div
                  style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                  className="text-xl mb-3"
                >
                  {v.title}
                </div>
                <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* BRANDS */}
      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-2xl sm:text-3xl font-light mb-3"
        >
          Products We Trust
        </h2>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-8 sm:mb-10">
          We only use quality, tried-and-tested products on your hair and nails.
        </p>
        <div className="flex gap-3 flex-wrap">
          {['ORS', 'Dark & Lovely', 'Cantu', 'OPI', 'CND', "Africa's Best"].map((brand) => (
            <div
              key={brand}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              className="px-5 py-2 rounded-full text-sm"
            >
              <span style={{ color: 'var(--text-muted)' }}>{brand}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{ background: 'var(--accent)' }}
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 text-center"
      >
        <h2
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent-fg)' }}
          className="text-3xl sm:text-4xl font-light mb-4"
        >
          Ready to experience Fhulu's Touch?
        </h2>
        <a
          href="/book"
          style={{ background: 'var(--accent-fg)', color: 'var(--accent)' }}
          className="inline-block px-8 sm:px-10 py-3 rounded-md text-sm font-semibold tracking-wide mt-2 hover:opacity-90 transition-opacity"
        >
          Book Now
        </a>
      </section>
    </div>
  )
}
