'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Testimonial {
  id: string
  client_name: string
  content: string
  rating: number
  is_approved: boolean
  is_featured: boolean
  created_at: string
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')
  const [form, setForm] = useState({ client_name: '', content: '', rating: '5' })
  const [saving, setSaving] = useState(false)

  const fetchTestimonials = async () => {
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter === 'pending') query = query.eq('is_approved', false)
    if (filter === 'approved') query = query.eq('is_approved', true)

    const { data } = await query
    if (data) setTestimonials(data)
    setLoading(false)
  }

  useEffect(() => { fetchTestimonials() }, [filter])

  const toggleApproved = async (id: string, current: boolean) => {
    await supabase.from('testimonials').update({ is_approved: !current }).eq('id', id)
    fetchTestimonials()
  }

  const toggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('testimonials').update({ is_featured: !current }).eq('id', id)
    fetchTestimonials()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    await supabase.from('testimonials').delete().eq('id', id)
    fetchTestimonials()
  }

  const handleAdd = async () => {
    if (!form.client_name || !form.content) return
    setSaving(true)
    await supabase.from('testimonials').insert({
      client_name: form.client_name,
      content: form.content,
      rating: Number(form.rating),
      is_approved: true,
    })
    setForm({ client_name: '', content: '', rating: '5' })
    setSaving(false)
    fetchTestimonials()
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
          Testimonials
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Approve reviews and pin the best ones to the homepage
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* LEFT — reviews list */}
        <div className="col-span-2">
          <div className="flex gap-2 mb-6">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  background: filter === f ? 'var(--accent)' : 'var(--surface)',
                  color: filter === f ? 'var(--accent-fg)' : 'var(--text-muted)',
                  border: '1px solid var(--border)',
                }}
                className="px-4 py-2 rounded-full text-xs capitalize transition-all"
              >
                {f}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-12">
              Loading...
            </div>
          ) : testimonials.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-12">
              No reviews found
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${t.is_featured ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                  className="p-5 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div style={{ color: 'var(--text)' }} className="font-medium text-sm">
                        {t.client_name}
                      </div>
                      <div style={{ color: 'var(--accent)' }} className="text-xs mt-0.5">
                        {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                      </div>
                    </div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                      {new Date(t.created_at).toLocaleDateString('en-ZA')}
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-muted)' }} className="text-sm italic leading-relaxed mb-4">
                    "{t.content}"
                  </p>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => toggleApproved(t.id, t.is_approved)}
                      style={{
                        background: t.is_approved ? '#25D36622' : 'var(--bg)',
                        color: t.is_approved ? '#25D366' : 'var(--text-muted)',
                        border: `1px solid ${t.is_approved ? '#25D36644' : 'var(--border)'}`,
                      }}
                      className="text-xs px-3 py-1.5 rounded-md transition-all"
                    >
                      {t.is_approved ? '✓ Approved' : 'Approve'}
                    </button>
                    <button
                      onClick={() => toggleFeatured(t.id, t.is_featured)}
                      style={{
                        background: t.is_featured ? '#f0a50022' : 'var(--bg)',
                        color: t.is_featured ? '#f0a500' : 'var(--text-muted)',
                        border: `1px solid ${t.is_featured ? '#f0a50044' : 'var(--border)'}`,
                      }}
                      className="text-xs px-3 py-1.5 rounded-md transition-all"
                    >
                      {t.is_featured ? '★ Featured' : '☆ Feature'}
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      style={{ background: '#e85a5a22', color: '#e85a5a', border: '1px solid #e85a5a44' }}
                      className="text-xs px-3 py-1.5 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT — add manually */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="p-6 rounded-xl h-fit"
        >
          <div
            style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
            className="text-xl mb-6"
          >
            Add Review Manually
          </div>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            CLIENT NAME
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. Thandi M."
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            RATING
          </label>
          <select
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{'★'.repeat(r)} {r} star{r !== 1 ? 's' : ''}</option>
            ))}
          </select>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            REVIEW
          </label>
          <textarea
            style={{ ...inputStyle, resize: 'none' }}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-6 h-28"
            placeholder="What did the client say..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <button
            onClick={handleAdd}
            disabled={saving}
            style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
            className="w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
          >
            {saving ? 'Adding...' : 'Add Review'}
          </button>
        </div>
      </div>
    </div>
  )
}