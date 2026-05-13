'use client'

import { useTheme } from '@/context/ThemeContext'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: 'luxe', label: 'Luxe', color: '#C9A84C' },
    { id: 'blossom', label: 'Blossom', color: '#e8758a' },
    { id: 'chrome', label: 'Chrome', color: '#111111' },
  ] as const

  return (
    <div className="flex items-center gap-2">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          style={{ backgroundColor: t.color }}
          className={`w-5 h-5 rounded-full border-2 transition-all ${
            theme === t.id ? 'border-white scale-110' : 'border-transparent opacity-60'
          }`}
        />
      ))}
    </div>
  )
}