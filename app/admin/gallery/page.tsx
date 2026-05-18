'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Upload, Star, Trash2, AlertCircle, CheckCircle, Pencil, X } from 'lucide-react'

interface Photo {
  id: string
  storage_path: string
  category: string
  caption: string
  description: string | null
  is_featured: boolean
}

const CATEGORIES = ['braids', 'nails', 'locs', 'colour', 'natural']

export default function AdminGallery() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [category, setCategory] = useState('braids')
  const [caption, setCaption] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ caption: '', description: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const fetchPhotos = async () => {
    const { data, error: fetchError } = await supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      setError('Could not load photos: ' + fetchError.message)
    } else {
      setPhotos(data ?? [])
    }
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
    setError('')
    setUploadSuccess(false)

    const ext = file.name.split('.').pop()
    const path = `${category}/${Date.now()}.${ext}`

    const { error: storageError } = await supabase.storage
      .from('gallery')
      .upload(path, file)

    if (storageError) {
      setError('Upload failed: ' + storageError.message)
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    const { error: insertError } = await supabase.from('gallery_photos').insert({
      storage_path: path,
      category,
      caption,
      description: description.trim() || null,
    })

    if (insertError) {
      // Storage upload worked but DB insert failed — clean up the orphan file
      await supabase.storage.from('gallery').remove([path])
      setError('Photo saved to storage but database insert failed: ' + insertError.message)
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
      return
    }

    setCaption('')
    setDescription('')
    if (fileRef.current) fileRef.current.value = ''
    setUploading(false)
    setUploadSuccess(true)
    setTimeout(() => setUploadSuccess(false), 3000)
    fetchPhotos()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error: err } = await supabase
      .from('gallery_photos')
      .update({ is_featured: !current })
      .eq('id', id)
    if (err) setError('Could not update: ' + err.message)
    else fetchPhotos()
  }

  const startEdit = (p: Photo) => {
    setEditingId(p.id)
    setEditForm({ caption: p.caption ?? '', description: p.description ?? '' })
  }

  const handleUpdate = async (id: string) => {
    const { error: err } = await supabase
      .from('gallery_photos')
      .update({ caption: editForm.caption.trim() || null, description: editForm.description.trim() || null })
      .eq('id', id)
    if (err) setError('Update failed: ' + err.message)
    else { setEditingId(null); fetchPhotos() }
  }

  const handleDelete = async (id: string, path: string) => {
    if (!confirm('Delete this photo?')) return
    await supabase.storage.from('gallery').remove([path])
    const { error: err } = await supabase.from('gallery_photos').delete().eq('id', id)
    if (err) setError('Delete failed: ' + err.message)
    else fetchPhotos()
  }

  const inputStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10">
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

      {/* Global error banner */}
      {error && (
        <div
          style={{ color: '#e85a5a', background: 'rgba(232,90,90,0.08)', border: '1px solid rgba(232,90,90,0.2)' }}
          className="flex items-start gap-3 px-4 py-3 rounded-lg text-sm mb-6"
        >
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium mb-0.5">Something went wrong</div>
            <div style={{ opacity: 0.85 }}>{error}</div>
            {error.includes('row-level security') && (
              <div className="mt-2 opacity-80">
                Fix: run the RLS policy SQL in your Supabase dashboard → SQL Editor.
              </div>
            )}
          </div>
          <button onClick={() => setError('')} className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* UPLOAD FORM */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="p-6 rounded-xl h-fit lg:sticky lg:top-6"
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
            NAME <span style={{ fontWeight: 300 }}>(optional)</span>
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. Knotless braids with curls"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            DESCRIPTION <span style={{ fontWeight: 300 }}>(optional)</span>
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. Hip-length, added colour"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div
            style={{ border: '2px dashed var(--border)', background: 'var(--bg)' }}
            className="rounded-lg p-8 text-center mb-4 cursor-pointer hover:border-[var(--accent)] transition-colors"
            onClick={() => !uploading && fileRef.current?.click()}
          >
            <Upload size={24} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
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

          {uploadSuccess && (
            <div className="flex items-center gap-2 text-sm mb-3" style={{ color: 'var(--accent)' }}>
              <CheckCircle size={15} />
              Photo uploaded successfully.
            </div>
          )}

          <p style={{ color: 'var(--text-muted)' }} className="text-xs">
            JPG, PNG or WEBP. Max 10 MB.
          </p>
        </div>

        {/* PHOTO GRID */}
        <div className="lg:col-span-2">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
              Loading photos...
            </div>
          ) : photos.length === 0 && !error ? (
            <div
              style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
              className="rounded-xl text-sm text-center py-16"
            >
              No photos yet — upload your first one
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((p) => (
                <div
                  key={p.id}
                  style={{ border: p.is_featured ? '2px solid var(--accent)' : '1px solid var(--border)' }}
                  className="rounded-xl overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={getPublicUrl(p.storage_path)}
                      alt={p.caption || p.category}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div
                    style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
                    className="p-3"
                  >
                    {editingId === p.id ? (
                      <div className="flex flex-col gap-2">
                        <input
                          style={inputStyle}
                          className="w-full px-2 py-1.5 rounded text-xs outline-none focus:border-[var(--accent)]"
                          placeholder="Name"
                          value={editForm.caption}
                          onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                        />
                        <input
                          style={inputStyle}
                          className="w-full px-2 py-1.5 rounded text-xs outline-none focus:border-[var(--accent)]"
                          placeholder="Description"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(p.id)}
                            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                            className="flex-1 text-xs py-1.5 rounded-md font-medium"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                            className="px-3 py-1.5 rounded-md"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <div style={{ color: 'var(--text)' }} className="text-xs font-medium capitalize">
                            {p.caption || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>no name</span>}
                          </div>
                          <button onClick={() => startEdit(p)} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0 hover:text-[var(--text)]">
                            <Pencil size={11} />
                          </button>
                        </div>
                        {p.description && (
                          <div style={{ color: 'var(--text-muted)' }} className="text-xs mb-2 truncate opacity-70">
                            {p.description}
                          </div>
                        )}
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => toggleFeatured(p.id, p.is_featured)}
                            style={{
                              background: p.is_featured ? 'rgba(240,165,0,0.12)' : 'var(--bg)',
                              color: p.is_featured ? '#f0a500' : 'var(--text-muted)',
                              border: `1px solid ${p.is_featured ? 'rgba(240,165,0,0.3)' : 'var(--border)'}`,
                            }}
                            className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-md transition-all"
                          >
                            <Star size={12} />
                            {p.is_featured ? 'Featured' : 'Feature'}
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.storage_path)}
                            style={{ background: 'rgba(232,90,90,0.1)', color: '#e85a5a', border: '1px solid rgba(232,90,90,0.2)' }}
                            className="px-3 py-1.5 rounded-md"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </>
                    )}
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
