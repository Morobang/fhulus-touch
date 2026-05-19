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
  Menu,
  X,
  HelpCircle,
} from 'lucide-react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/availability', label: 'Availability', icon: Clock },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Star },
  { href: '/admin/promotions', label: 'Promotions', icon: Gift },
  { href: '/admin/faq', label: 'FAQ', icon: HelpCircle },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [checking, setChecking] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.replace('/login')
      else setChecking(false)
    })
  }, [router])

  // close drawer when route changes
  useEffect(() => { setOpen(false) }, [pathname])

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

  const SidebarContent = () => (
    <>
      <div style={{ borderBottom: '1px solid var(--border)' }} className="px-6 py-5 flex items-center justify-between">
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }} className="text-lg font-semibold">
            Fhulu's Touch
          </div>
          <div style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }} className="text-xs mt-0.5">
            ADMIN PANEL
          </div>
        </div>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="lg:hidden p-1 rounded"
          style={{ color: 'var(--text-muted)' }}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                background: active ? 'var(--bg)' : 'transparent',
                color: active ? 'var(--text)' : 'var(--text-muted)',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-all hover:text-[var(--text)]"
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--border)' }} className="px-3 py-4">
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
    </>
  )

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* DESKTOP SIDEBAR — always visible on lg+ */}
      <aside
        style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
        className="hidden lg:flex w-56 flex-shrink-0 flex-col"
      >
        <SidebarContent />
      </aside>

      {/* MOBILE DRAWER — slides in from left */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <aside
            style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)' }}
            className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col lg:hidden"
          >
            <SidebarContent />
          </aside>
        </>
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* MOBILE TOP BAR */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
          style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}
        >
          <button
            onClick={() => setOpen(true)}
            style={{ color: 'var(--text-muted)' }}
            className="p-1.5 rounded-md hover:text-[var(--text)] transition-colors"
          >
            <Menu size={20} />
          </button>
          <span style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }} className="text-base font-semibold">
            Fhulu's Touch
          </span>
          <span style={{ color: 'var(--text-muted)' }} className="text-xs ml-auto">
            {navItems.find(n => n.href === pathname)?.label ?? 'Admin'}
          </span>
        </div>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
