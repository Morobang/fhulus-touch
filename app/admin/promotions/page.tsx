'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Promotion {
  id: string
  title: string
  description: string
  discount_percent: number
  valid_until: string
  is_active: boolean
  created_at: string
}

const EMPTY = { title: '', description: '', discount_percent: '', valid_until: '' }

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [form, setForm] = useState<any>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchPromotions = async () => {
    const { data } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setPromotions(data)
    setLoading(false)
  }

  useEffect(() => { fetchPromotions() }, [])

  const handleSave = async () => {
    if (!form.title) return
    setSaving(true)

    const payload = {
      title: form.title,
      description: form.description,
      discount_percent: form.discount_percent ? Number(form.discount_percent) : null,
      valid_until: form.valid_until || null,
    }

    if (editing) {
      await supabase.from('promotions').update(payload).eq('id', editing)
    } else {
      await supabase.from('promotions').insert(payload)
    }

    setForm(EMPTY)
    setEditing(null)
    setSaving(false)
    fetchPromotions()
  }

  const toggleActive = async (id: string, current: boolean) => {
    await supabase.from('promotions').update({ is_active: !current }).eq('id', id)
    fetchPromotions()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion?')) return
    await supabase.from('promotions').delete().eq('id', id)
    fetchPromotions()
  }

  const startEdit = (p: Promotion) => {
    setEditing(p.id)
    setForm({
      title: p.title,
      description: p.description,
      discount_percent: p.discount_percent || '',
      valid_until: p.valid_until || '',
    })
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
          Promotions
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Create and manage specials that show on the homepage and promotions page
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* LEFT — promotions list */}
        <div className="col-span-2">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-12">
              Loading...
            </div>
          ) : promotions.length === 0 ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm text-center py-12">
              No promotions yet
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {promotions.map((p) => (
                <div
                  key={p.id}
                  style={{
                    background: 'var(--surface)',
                    border: `1px solid ${p.is_active ? 'var(--accent)' : 'var(--border)'}`,
                    opacity: p.is_active ? 1 : 0.6,
                  }}
                  className="p-6 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div
                        style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
                        className="text-xl mb-1"
                      >
                        {p.title}
                      </div>
                      {p.discount_percent && (
                        <div
                          style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                          className="inline-block text-xs px-2 py-0.5 rounded font-medium mb-2"
                        >
                          {p.discount_percent}% OFF
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        color: p.is_active ? '#25D366' : 'var(--text-muted)',
                        background: p.is_active ? '#25D36622' : 'var(--bg)',
                        border: `1px solid ${p.is_active ? '#25D36644' : 'var(--border)'}`,
                        letterSpacing: '0.08em',
                      }}
                      className="text-xs px-3 py-1 rounded-full font-medium"
                    >
                      {p.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>

                  {p.description && (
                    <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-3">
                      {p.description}
                    </p>
                  )}

                  {p.valid_until && (
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs mb-4">
                      Valid until {new Date(p.valid_until).toLocaleDateString('en-ZA')}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(p.id, p.is_active)}
                      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                      className="text-xs px-3 py-1.5 rounded-md"
                    >
                      {p.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => startEdit(p)}
                      style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                      className="text-xs px-3 py-1.5 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
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

        {/* RIGHT — form */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="p-6 rounded-xl h-fit"
        >
          <div
            style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
            className="text-xl mb-6"
          >
            {editing ? 'Edit Promotion' : 'New Promotion'}
          </div>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            TITLE
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. Tuesday Nail Special"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            DESCRIPTION
          </label>
          <textarea
            style={{ ...inputStyle, resize: 'none' }}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4 h-24"
            placeholder="e.g. Get 10% off all gel nail services every Tuesday"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            DISCOUNT % <span style={{ fontWeight: 300 }}>(optional)</span>
          </label>
          <input
            type="number"
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. 10"
            value={form.discount_percent}
            onChange={(e) => setForm({ ...form, discount_percent: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            VALID UNTIL <span style={{ fontWeight: 300 }}>(optional)</span>
          </label>
          <input
            type="date"
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-6"
            value={form.valid_until}
            onChange={(e) => setForm({ ...form, valid_until: e.target.value })}
          />

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              className="flex-1 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Promotion'}
            </button>
            {editing && (
              <button
                onClick={() => { setEditing(null); setForm(EMPTY) }}
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                className="px-4 py-3 rounded-lg text-sm"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}