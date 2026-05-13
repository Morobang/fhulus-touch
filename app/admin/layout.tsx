'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { href: '/admin/services', label: 'Services', icon: '✂️' },
    { href: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
    { href: '/admin/clients', label: 'Clients', icon: '👥' },
    { href: '/admin/availability', label: 'Availability', icon: '⏰' },
    { href: '/admin/testimonials', label: 'Testimonials', icon: '⭐' },
    { href: '/admin/promotions', label: 'Promotions', icon: '🎁' },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* SIDEBAR */}
      <aside
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
        className="w-56 flex-shrink-0 flex flex-col"
      >
        <div
          style={{ borderBottom: '1px solid var(--border)' }}
          className="px-6 py-6"
        >
          <div
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}
            className="text-lg font-semibold"
          >
            Fhulu's Touch
          </div>
          <div
            style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}
            className="text-xs mt-1"
          >
            ADMIN PANEL
          </div>
        </div>

        <nav className="flex-1 py-4 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                background: pathname === item.href ? 'var(--bg)' : 'transparent',
                color: pathname === item.href ? 'var(--text)' : 'var(--text-muted)',
                border: pathname === item.href ? '1px solid var(--border)' : '1px solid transparent',
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-all hover:text-[var(--text)]"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div
          style={{ borderTop: '1px solid var(--border)' }}
          className="px-3 py-4"
        >
          <Link
            href="/"
            style={{ color: 'var(--text-muted)' }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:text-[var(--text)] transition-colors mb-1"
          >
            <span>🌐</span>
            <span>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{ color: 'var(--text-muted)' }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:text-[var(--text)] transition-colors"
          >
            <span>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}