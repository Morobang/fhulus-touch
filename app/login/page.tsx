'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Incorrect email or password.')
      setLoading(false)
      return
    }

    router.push('/admin')
    setLoading(false)
  }

  const inputStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: 'var(--bg)' }}
    >
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        className="w-full max-w-sm p-10 rounded-2xl"
      >
        <div
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--accent)' }}
          className="text-2xl font-semibold mb-1 text-center"
        >
          Fhulu's Touch
        </div>
        <div
          style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
          className="text-xs text-center mb-10"
        >
          ADMIN ACCESS
        </div>

        <label
          style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
          className="text-xs font-medium block mb-2"
        >
          EMAIL
        </label>
        <input
          style={inputStyle}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label
          style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
          className="text-xs font-medium block mb-2"
        >
          PASSWORD
        </label>
        <input
          style={inputStyle}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-6"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />

        {error && (
          <div
            style={{ color: '#e85a5a', background: 'rgba(232,90,90,0.1)', border: '1px solid rgba(232,90,90,0.2)' }}
            className="px-4 py-3 rounded-lg text-sm mb-4"
          >
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
          className="w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50 transition-opacity hover:opacity-85"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  )
}