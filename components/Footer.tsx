'use client'

import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'

const SOCIAL = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/flulu_faith?igsh=dXJxanVodmt3OXp5',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/share/18ZRADWLVm/',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@flulu1016?_r=1&_t=ZS-96VialK9ujs',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.17 8.17 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
      className="px-4 sm:px-8 lg:px-12 py-10"
    >
      <div className="flex flex-col gap-8">
        {/* TOP ROW */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
          {/* Brand + social */}
          <div>
            <div
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}
              className="text-lg font-semibold mb-1"
            >
              Fhulu's Touch
            </div>
            <div style={{ color: 'var(--text-muted)' }} className="text-xs mb-4">
              Hair & Nails · Polokwane & Mokopane
            </div>
            <div className="flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 max-w-sm">
            {[
              { label: 'Services', href: '/services' },
              { label: 'Prices', href: '/prices' },
              { label: 'Gallery', href: '/gallery' },
              { label: 'Before & After', href: '/before-after' },
              { label: 'Specials', href: '/promotions' },
              { label: 'FAQ', href: '/faq' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Book Now', href: '/book' },
              { label: 'Leave a Review', href: '/review' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: 'var(--text-muted)' }}
                className="text-xs hover:text-[var(--text)] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact + theme */}
          <div className="flex flex-col gap-3">
            <div style={{ color: 'var(--text-muted)' }} className="text-xs sm:text-right">
              <div>076 906 8341</div>
              <div className="mt-1">fhulufhelomarubini36@gmail.com</div>
            </div>
            <div className="sm:flex sm:justify-end">
              <ThemeSwitcher />
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
          className="pt-4 text-xs"
        >
          © {new Date().getFullYear()} Fhulu's Touch. Polokwane & Mokopane, Limpopo.
        </div>
      </div>
    </footer>
  )
}
