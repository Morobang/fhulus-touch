'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number | null
  is_visible: boolean
}

const EMPTY = { name: '', category: 'Braids', price: '', duration_min: '' }

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState<typeof EMPTY>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('category')
      .order('name')
    if (data) setServices(data)
    setLoading(false)
  }

  useEffect(() => { fetchServices() }, [])

  const handleSave = async () => {
    if (!form.name.trim()) { setError('Service name is required.'); return }
    if (!form.price) { setError('Price is required.'); return }

    setSaving(true)
    setError('')
    setSaved(false)

    const payload = {
      name: form.name.trim(),
      category: form.category.trim() || 'Hair',
      price: Number(form.price),
      duration_min: form.duration_min ? Number(form.duration_min) : null,
    }

    const { error: dbError } = editing
      ? await supabase.from('services').update(payload).eq('id', editing)
      : await supabase.from('services').insert(payload)

    if (dbError) {
      setError('Save failed: ' + dbError.message)
      setSaving(false)
      return
    }

    setForm(EMPTY)
    setEditing(null)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    fetchServices()
  }

  const toggleVisible = async (id: string, current: boolean) => {
    await supabase.from('services').update({ is_visible: !current }).eq('id', id)
    fetchServices()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    fetchServices()
  }

  const startEdit = (s: Service) => {
    setEditing(s.id)
    setError('')
    setSaved(false)
    setForm({
      name: s.name,
      category: s.category,
      price: String(s.price),
      duration_min: s.duration_min ? String(s.duration_min) : '',
    })
  }

  const inputStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  // Group services by category
  const grouped = services.reduce<Record<string, Service[]>>((acc, s) => {
    const cat = s.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-4xl font-light mb-2"
        >
          Services
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Add, edit, hide or delete services. They appear on the booking page.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — service list */}
        <div className="lg:col-span-2">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm py-12 text-center">
              Loading...
            </div>
          ) : services.length === 0 ? (
            <div
              style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
              className="rounded-xl py-16 text-center text-sm"
            >
              No services yet — add your first one using the form.
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-8">
                <div
                  style={{ color: 'var(--accent)', letterSpacing: '0.14em', borderBottom: '1px solid var(--border)' }}
                  className="text-xs font-medium mb-3 pb-3"
                >
                  {category.toUpperCase()}
                </div>
                {items.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      background: editing === s.id ? 'var(--bg-secondary)' : 'var(--surface)',
                      border: editing === s.id ? '1px solid var(--accent)' : '1px solid var(--border)',
                      opacity: s.is_visible ? 1 : 0.55,
                    }}
                    className="flex items-center justify-between px-5 py-4 rounded-lg mb-2 transition-all"
                  >
                    <div>
                      <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
                        {s.name}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                        R{s.price}
                        {s.duration_min ? ` · ${s.duration_min} min` : ''}
                        {!s.is_visible && (
                          <span style={{ color: 'var(--accent)', marginLeft: 8 }}>hidden</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleVisible(s.id, s.is_visible)}
                        title={s.is_visible ? 'Hide' : 'Show'}
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                        className="p-2 rounded-md hover:text-[var(--text)] transition-colors"
                      >
                        {s.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        onClick={() => startEdit(s)}
                        title="Edit"
                        style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                        className="p-2 rounded-md hover:text-[var(--text)] transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        title="Delete"
                        style={{ background: '#e85a5a18', color: '#e85a5a', border: '1px solid #e85a5a33' }}
                        className="p-2 rounded-md"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>

        {/* RIGHT — add/edit form */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="p-6 rounded-xl h-fit lg:sticky lg:top-6"
        >
          <div
            style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
            className="text-xl mb-6 flex items-center gap-2"
          >
            {editing ? <Pencil size={18} /> : <Plus size={18} />}
            {editing ? 'Edit Service' : 'Add Service'}
          </div>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            SERVICE NAME *
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4 focus:border-[var(--accent)]"
            placeholder="e.g. Knotless Braids"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            CATEGORY
          </label>
          <input
            list="category-suggestions"
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4 focus:border-[var(--accent)]"
            placeholder="e.g. Braids"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <datalist id="category-suggestions">
            <option value="Braids" />
            <option value="Hair" />
            <option value="Nails" />
            <option value="Extras" />
            <option value="Add-ons" />
          </datalist>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            PRICE (R) *
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4 focus:border-[var(--accent)]"
            placeholder="e.g. 300"
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            DURATION (minutes) <span style={{ fontWeight: 300 }}>— optional</span>
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-6 focus:border-[var(--accent)]"
            placeholder="e.g. 180"
            type="number"
            min="0"
            value={form.duration_min}
            onChange={(e) => setForm({ ...form, duration_min: e.target.value })}
          />

          {error && (
            <div
              style={{ color: '#e85a5a', background: 'rgba(232,90,90,0.08)', border: '1px solid rgba(232,90,90,0.2)' }}
              className="px-4 py-3 rounded-lg text-sm mb-4"
            >
              {error}
            </div>
          )}

          {saved && (
            <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--accent)' }}>
              <CheckCircle size={15} />
              Saved successfully.
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              className="flex-1 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Service'}
            </button>
            {editing && (
              <button
                onClick={() => { setEditing(null); setForm(EMPTY); setError('') }}
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
