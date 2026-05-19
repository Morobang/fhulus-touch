'use client'

import { usePathname } from 'next/navigation'
import { MessageCircle } from 'lucide-react'
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

      {/* Floating WhatsApp button */}
      <a
        href={`whatsapp://send?phone=27769068341&text=${encodeURIComponent("Hi Fhulu! 👋 I'd like to enquire about booking an appointment at Fhulu's Touch.")}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp Fhulu"
        className="fixed bottom-6 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
        style={{ background: '#25D366', color: '#fff' }}
      >
        <MessageCircle size={20} />
        <span className="hidden sm:inline text-sm font-semibold">WhatsApp Us</span>
      </a>
    </>
  )
}
