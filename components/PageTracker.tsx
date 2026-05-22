'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    navigator.sendBeacon('/api/track', JSON.stringify({ page: pathname }))
  }, [pathname])

  return null
}
