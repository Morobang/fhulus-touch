'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isFullscreen = pathname?.startsWith('/admin') || pathname === '/login'

  if (isFullscreen) return <>{children}</>

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
