'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Photo {
  id: string
  storage_path: string
  category: string
  caption: string
  is_featured: boolean
}

const CATEGORIES = ['braids', 'nails', 'locs', 'colour', 'natural']

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('braids')
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchPhotos = async () => {
    const { data } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPhotos(data)
    setLoading(false)
  }

  useEffect(() => { fetchPhotos() }, [])

  const getPublicUrl = (path: string) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    return data.publicUrl
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${category}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('gallery')
      .upload(path, file)

    if (uploadError) {
      alert('Upload failed. Try again.')
      setUploading(false)
      return
    }

    await supabase.from('gallery_photos').insert({
      storage_path: path,
      category,
      caption,
    })

    setCaption('')
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
    fetchPhotos()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('gallery_photos').update({ is_featured: !current }).eq('id', id)
    fetchPhotos()
  }

  const handleDelete = async (id: string, path: string) => {
    if (!confirm('Delete this photo?')) return
    await supabase.storage.from('gallery').remove([path])
    await supabase.from('gallery_photos').delete().eq('id', id)
    fetchPhotos()
  }

  const inputStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-4xl font-light mb-2"
        >
          Gallery
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Upload and manage photos — featured photos show on the homepage
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* UPLOAD FORM */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="p-6 rounded-xl h-fit"
        >
          <div
            style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
            className="text-xl mb-6"
          >
            Upload Photo
          </div>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            CATEGORY
          </label>
          <select
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4 capitalize"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">{c}</option>
            ))}
          </select>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            CAPTION <span style={{ fontWeight: 300 }}>(optional)</span>
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. Knotless braids with curls"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            PHOTO
          </label>
          <div
            style={{ border: '2px dashed var(--border)', background: 'var(--bg)' }}
            className="rounded-lg p-8 text-center mb-4 cursor-pointer hover:border-[var(--accent)] transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            <div className="text-2xl mb-2">📷</div>
            <div style={{ color: 'var(--text-muted)' }} className="text-xs">
              {uploading ? 'Uploading...' : 'Click to select photo'}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </div>

          <p style={{ color: 'var(--text-muted)' }} className="text-xs">
            JPG, PNG or WEBP. Max 10MB.
          </p>
        </div>

        {/* PHOTO GRID */}
        <div className="col-span-2">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
              Loading photos...
            </div>
          ) : photos.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
              No photos yet — upload your first one
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {photos.map((p) => (
                <div
                  key={p.id}
                  style={{ border: '1px solid var(--border)' }}
                  className="rounded-xl overflow-hidden"
                >
                  <img
                    src={getPublicUrl(p.storage_path)}
                    alt={p.caption || p.category}
                    className="w-full aspect-square object-cover"
                  />
                  <div
                    style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
                    className="p-3"
                  >
                    <div style={{ color: 'var(--text)' }} className="text-xs font-medium mb-1 capitalize">
                      {p.category}
                    </div>
                    {p.caption && (
                      <div style={{ color: 'var(--text-muted)' }} className="text-xs mb-2 truncate">
                        {p.caption}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleFeatured(p.id, p.is_featured)}
                        style={{
                          background: p.is_featured ? '#f0a50022' : 'var(--bg)',
                          color: p.is_featured ? '#f0a500' : 'var(--text-muted)',
                          border: `1px solid ${p.is_featured ? '#f0a50044' : 'var(--border)'}`,
                        }}
                        className="flex-1 text-xs py-1.5 rounded-md transition-all"
                      >
                        {p.is_featured ? '★ Featured' : '☆ Feature'}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.storage_path)}
                        style={{ background: '#e85a5a22', color: '#e85a5a', border: '1px solid #e85a5a44' }}
                        className="px-3 py-1.5 rounded-md text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}