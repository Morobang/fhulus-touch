'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeSwitcher from './ThemeSwitcher'

export default function Navbar() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/before-after', label: 'Before & After' },
    { href: '/promotions', label: 'Specials' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav
      style={{
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4"
    >
      <Link href="/" style={{ color: 'var(--accent)' }} className="font-serif text-xl font-semibold tracking-wide">
        Fhulu's Touch
      </Link>

      <div className="flex items-center gap-1">
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

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <Link
          href="/book"
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          className="px-5 py-2 rounded-md text-sm font-medium tracking-wide transition-opacity hover:opacity-85"
        >
          Book Now
        </Link>
      </div>
    </nav>
  )
}