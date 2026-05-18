'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Upload, CheckCircle, UserCircle } from 'lucide-react'

export default function AdminSettingsPage() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const { data } = supabase.storage.from('gallery').getPublicUrl('profile/owner.jpg')
    // probe whether the file actually exists
    fetch(data.publicUrl, { method: 'HEAD' })
      .then((r) => { if (r.ok) setPhotoUrl(data.publicUrl) })
      .catch(() => {})
  }, [])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP).')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.')
      return
    }

    setUploading(true)
    setError('')
    setSaved(false)

    const ext = file.name.split('.').pop()
    const path = `profile/owner.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError('Upload failed: ' + uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    setPhotoUrl(data.publicUrl + '?t=' + Date.now())
    setSaved(true)
    setUploading(false)
  }

  return (
    <div className="p-10 max-w-xl">
      <h1
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
        className="text-4xl font-light mb-2"
      >
        Settings
      </h1>
      <p style={{ color: 'var(--text-muted)' }} className="text-sm mb-10">
        Manage your public profile shown on the About page.
      </p>

      {/* PROFILE PHOTO */}
      <div
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        className="rounded-2xl p-8"
      >
        <div
          style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
          className="text-xs font-medium mb-6"
        >
          PROFILE PHOTO
        </div>

        {/* Preview */}
        <div className="flex items-center gap-6 mb-6">
          <div
            style={{ background: 'var(--bg)', border: '2px solid var(--border)' }}
            className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
          >
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt="Fhulu profile photo"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            ) : (
              <UserCircle size={48} style={{ color: 'var(--text-muted)' }} />
            )}
          </div>
          <div>
            <div style={{ color: 'var(--text)' }} className="text-sm font-medium mb-1">
              {photoUrl ? 'Photo uploaded' : 'No photo yet'}
            </div>
            <div style={{ color: 'var(--text-muted)' }} className="text-xs leading-relaxed">
              This photo shows on the About page.<br />
              JPG, PNG or WebP — max 5 MB.
            </div>
          </div>
        </div>

        {/* Upload button */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            background: uploading ? 'var(--border)' : 'var(--accent)',
            color: uploading ? 'var(--text-muted)' : 'var(--accent-fg)',
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-85 disabled:cursor-not-allowed"
        >
          <Upload size={16} />
          {uploading ? 'Uploading…' : photoUrl ? 'Replace Photo' : 'Upload Photo'}
        </button>

        {saved && (
          <div className="flex items-center gap-2 mt-4 text-sm" style={{ color: 'var(--accent)' }}>
            <CheckCircle size={16} />
            Photo saved — it will now appear on the About page.
          </div>
        )}

        {error && (
          <div
            style={{ color: '#e85a5a', background: 'rgba(232,90,90,0.08)', border: '1px solid rgba(232,90,90,0.2)' }}
            className="mt-4 px-4 py-3 rounded-lg text-sm"
          >
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
