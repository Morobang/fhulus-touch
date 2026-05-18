'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'luxe' | 'blossom' | 'chrome'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'blossom',
  setTheme: () => {}
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('blossom')

  useEffect(() => {
    const saved = localStorage.getItem('fhulu-theme') as Theme
    if (saved) setThemeState(saved)
  }, [])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('fhulu-theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)