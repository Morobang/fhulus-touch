'use client'

import Link from 'next/link'
import ThemeSwitcher from './ThemeSwitcher'

export default function Footer() {
  return (
    <footer
      style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
      className="px-4 sm:px-8 lg:px-12 py-10"
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
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

        <div className="flex flex-wrap gap-4">
          {['Services', 'Gallery', 'FAQ', 'About', 'Contact', 'Book'].map((l) => (
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
    </footer>
  )
}
