'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/prices', label: 'Prices' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/before-after', label: 'Before & After' },
    { href: '/promotions', label: 'Specials' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <>
      <nav
        style={{
          background: 'var(--nav-bg)',
          borderBottom: '1px solid var(--border)',
          backdropFilter: 'blur(12px)',
        }}
        className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 py-4"
      >
        <Link href="/" style={{ color: 'var(--accent)' }} className="font-serif text-xl font-semibold tracking-wide">
          Fhulu's Touch
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: pathname === l.href ? 'var(--text)' : 'var(--text-muted)',
                background: pathname === l.href ? 'var(--surface)' : 'transparent',
              }}
              className="px-3 py-2 rounded-md text-sm transition-all hover:text-[var(--text)]"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/book"
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            className="px-4 sm:px-5 py-2 rounded-md text-sm font-medium tracking-wide transition-opacity hover:opacity-85"
          >
            Book Now
          </Link>
          {/* Hamburger — mobile/tablet only */}
          <button
            onClick={() => setOpen(!open)}
            style={{ color: 'var(--text)' }}
            className="lg:hidden p-2 rounded-md"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 flex"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="flex-1" style={{ background: 'rgba(0,0,0,0.4)' }} />

          {/* Slide-in panel */}
          <div
            style={{
              background: 'var(--surface)',
              borderLeft: '1px solid var(--border)',
              width: '260px',
            }}
            className="flex flex-col py-6 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{ color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}
              className="text-lg font-semibold mb-6 px-2"
            >
              Fhulu's Touch
            </div>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  color: pathname === l.href ? 'var(--text)' : 'var(--text-muted)',
                  background: pathname === l.href ? 'var(--bg)' : 'transparent',
                  border: pathname === l.href ? '1px solid var(--border)' : '1px solid transparent',
                }}
                className="flex items-center px-3 py-3 rounded-lg text-sm mb-1 transition-all"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
