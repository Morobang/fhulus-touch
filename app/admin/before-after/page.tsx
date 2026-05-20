'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Upload, Trash2, AlertCircle, CheckCircle, X } from 'lucide-react'

interface BeforeAfter {
  id: string
  before_path: string
  after_path: string
  service_type: string
  caption: string
}

export default function AdminBeforeAfter() {
  const [items, setItems] = useState<BeforeAfter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [beforeFile, setBeforeFile] = useState<File | null>(null)
  const [afterFile, setAfterFile] = useState<File | null>(null)
  const [serviceType, setServiceType] = useState('')
  const [caption, setCaption] = useState('')

  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)

  const fetchItems = async () => {
    const { data, error: fetchError } = await supabase
      .from('before_after')
      .select('*')
      .order('created_at', { ascending: false })
    if (fetchError) setError('Could not load items: ' + fetchError.message)
    else setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const getUrl = (path: string) => {
    const { data } = supabase.storage.from('gallery').getPublicUrl(path)
    return data.publicUrl
  }

  const uploadFile = async (file: File, prefix: string) => {
    const ext = file.name.split('.').pop()
    const path = `before-after/${prefix}-${Date.now()}.${ext}`
    const { error: storageError } = await supabase.storage.from('gallery').upload(path, file)
    if (storageError) throw new Error(storageError.message)
    return path
  }

  const handleSubmit = async () => {
    if (!beforeFile || !afterFile) {
      setError('Please select both a before and an after photo.')
      return
    }

    setUploading(true)
    setError('')
    setUploadSuccess(false)

    let beforePath = ''
    let afterPath = ''

    try {
      beforePath = await uploadFile(beforeFile, 'before')
      afterPath = await uploadFile(afterFile, 'after')
    } catch (err: unknown) {
      if (beforePath) await supabase.storage.from('gallery').remove([beforePath])
      setError('Upload failed: ' + (err instanceof Error ? err.message : 'Unknown error'))
      setUploading(false)
      return
    }

    const { error: insertError } = await supabase.from('before_after').insert({
      before_path: beforePath,
      after_path: afterPath,
      service_type: serviceType.trim(),
      caption: caption.trim(),
    })

    if (insertError) {
      await supabase.storage.from('gallery').remove([beforePath, afterPath])
      setError('Database insert failed: ' + insertError.message)
      setUploading(false)
      return
    }

    setBeforeFile(null)
    setAfterFile(null)
    setServiceType('')
    setCaption('')
    if (beforeRef.current) beforeRef.current.value = ''
    if (afterRef.current) afterRef.current.value = ''
    setUploading(false)
    setUploadSuccess(true)
    setTimeout(() => setUploadSuccess(false), 3000)
    fetchItems()
  }

  const handleDelete = async (item: BeforeAfter) => {
    if (!confirm('Delete this before & after pair?')) return
    await supabase.storage.from('gallery').remove([item.before_path, item.after_path])
    const { error: err } = await supabase.from('before_after').delete().eq('id', item.id)
    if (err) setError('Delete failed: ' + err.message)
    else fetchItems()
  }

  const inputStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  const FilePicker = ({
    label,
    file,
    inputRef,
    onChange,
  }: {
    label: string
    file: File | null
    inputRef: React.RefObject<HTMLInputElement | null>
    onChange: (f: File) => void
  }) => (
    <div>
      <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
        {label}
      </label>
      <div
        style={{
          border: file ? '2px solid var(--accent)' : '2px dashed var(--border)',
          background: 'var(--bg)',
        }}
        className="rounded-lg p-5 text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
        onClick={() => !uploading && inputRef.current?.click()}
      >
        {file ? (
          <div className="flex items-center justify-between gap-2">
            <span style={{ color: 'var(--text)' }} className="text-xs truncate flex-1 text-left">{file.name}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (inputRef.current) inputRef.current.value = ''
                onChange(null as unknown as File)
              }}
              style={{ color: 'var(--text-muted)' }}
              className="flex-shrink-0 hover:text-[var(--text)]"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <Upload size={20} className="mx-auto mb-1.5" style={{ color: 'var(--text-muted)' }} />
            <div style={{ color: 'var(--text-muted)' }} className="text-xs">Click to select photo</div>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) onChange(f)
          }}
        />
      </div>
    </div>
  )

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="mb-8">
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-4xl font-light mb-2"
        >
          Before &amp; After
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Upload transformation pairs — shown publicly on the Before &amp; After page
        </p>
      </div>

      {error && (
        <div
          style={{ color: '#e85a5a', background: 'rgba(232,90,90,0.08)', border: '1px solid rgba(232,90,90,0.2)' }}
          className="flex items-start gap-3 px-4 py-3 rounded-lg text-sm mb-6"
        >
          <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-medium mb-0.5">Something went wrong</div>
            <div style={{ opacity: 0.85 }}>{error}</div>
          </div>
          <button onClick={() => setError('')} className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100"><X size={14} /></button>
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
            Add Transformation
          </div>

          <div className="flex flex-col gap-4">
            <FilePicker
              label="BEFORE PHOTO"
              file={beforeFile}
              inputRef={beforeRef}
              onChange={(f) => setBeforeFile(f)}
            />
            <FilePicker
              label="AFTER PHOTO"
              file={afterFile}
              inputRef={afterRef}
              onChange={(f) => setAfterFile(f)}
            />

            <div>
              <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
                SERVICE TYPE <span style={{ fontWeight: 300 }}>(optional)</span>
              </label>
              <input
                style={inputStyle}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                placeholder="e.g. Braids, Natural Hair"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
              />
            </div>

            <div>
              <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
                CAPTION <span style={{ fontWeight: 300 }}>(optional)</span>
              </label>
              <input
                style={inputStyle}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                placeholder="e.g. Knotless box braids with colour"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={uploading || !beforeFile || !afterFile}
              style={{
                background: uploading || !beforeFile || !afterFile ? 'var(--border)' : 'var(--accent)',
                color: uploading || !beforeFile || !afterFile ? 'var(--text-muted)' : 'var(--accent-fg)',
              }}
              className="w-full py-3 rounded-lg text-sm font-medium transition-opacity disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading…' : 'Upload Pair'}
            </button>

            {uploadSuccess && (
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--accent)' }}>
                <CheckCircle size={15} />
                Transformation uploaded successfully.
              </div>
            )}

            <p style={{ color: 'var(--text-muted)' }} className="text-xs">
              JPG, PNG or WEBP. Max 10 MB each.
            </p>
          </div>
        </div>

        {/* PAIRS LIST */}
        <div className="lg:col-span-2">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-16">
              Loading transformations...
            </div>
          ) : items.length === 0 ? (
            <div
              style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
              className="rounded-xl text-sm text-center py-16"
            >
              No transformations yet — upload your first pair
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  className="rounded-xl overflow-hidden"
                >
                  <div className="grid grid-cols-2">
                    <div className="relative aspect-square">
                      <Image
                        src={getUrl(item.before_path)}
                        alt="Before"
                        fill
                        className="object-cover"
                      />
                      <div
                        style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', letterSpacing: '0.1em' }}
                        className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded"
                      >
                        BEFORE
                      </div>
                    </div>
                    <div className="relative aspect-square">
                      <Image
                        src={getUrl(item.after_path)}
                        alt="After"
                        fill
                        className="object-cover"
                      />
                      <div
                        style={{ background: 'var(--accent)', color: 'var(--accent-fg)', letterSpacing: '0.1em' }}
                        className="absolute top-2 left-2 text-xs px-2 py-0.5 rounded"
                      >
                        AFTER
                      </div>
                    </div>
                  </div>
                  <div
                    style={{ borderTop: '1px solid var(--border)' }}
                    className="px-4 py-3 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      {item.service_type && (
                        <div
                          style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
                          className="text-xs mb-0.5"
                        >
                          {item.service_type.toUpperCase()}
                        </div>
                      )}
                      {item.caption && (
                        <div style={{ color: 'var(--text-muted)' }} className="text-sm truncate">
                          {item.caption}
                        </div>
                      )}
                      {!item.service_type && !item.caption && (
                        <div style={{ color: 'var(--text-muted)', fontStyle: 'italic' }} className="text-sm">
                          No label
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item)}
                      style={{ background: 'rgba(232,90,90,0.1)', color: '#e85a5a', border: '1px solid rgba(232,90,90,0.2)' }}
                      className="flex-shrink-0 px-3 py-2 rounded-lg text-xs flex items-center gap-1.5"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
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
