'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  Image,
  Users,
  Clock,
  Star,
  Gift,
  Settings,
  Globe,
  LogOut,
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
      else setChecking(false)
    })
  }, [router])

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/services', label: 'Services', icon: Scissors },
    { href: '/admin/gallery', label: 'Gallery', icon: Image },
    { href: '/admin/clients', label: 'Clients', icon: Users },
    { href: '/admin/availability', label: 'Availability', icon: Clock },
    { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
    { href: '/admin/promotions', label: 'Promotions', icon: Gift },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div style={{ color: 'var(--text-muted)' }} className="text-sm">Checking session…</div>
      </div>
    )
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
          {navItems.map((item) => {
            const Icon = item.icon
            return (
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
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            )
          })}
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
            <Globe size={16} />
            <span>View Site</span>
          </Link>
          <button
            onClick={handleLogout}
            style={{ color: 'var(--text-muted)' }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:text-[var(--text)] transition-colors"
          >
            <LogOut size={16} />
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