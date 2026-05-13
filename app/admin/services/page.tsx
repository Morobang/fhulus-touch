'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number
  is_visible: boolean
}

const EMPTY = { name: '', category: 'hair', price: '', duration_min: '' }

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([])
  const [form, setForm] = useState<any>(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('category')
    if (data) setServices(data)
    setLoading(false)
  }

  useEffect(() => { fetchServices() }, [])

  const handleSave = async () => {
    if (!form.name || !form.price || !form.duration_min) return
    setSaving(true)

    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      duration_min: Number(form.duration_min),
    }

    if (editing) {
      await supabase.from('services').update(payload).eq('id', editing)
    } else {
      await supabase.from('services').insert(payload)
    }

    setForm(EMPTY)
    setEditing(null)
    setSaving(false)
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
    setForm({ name: s.name, category: s.category, price: s.price, duration_min: s.duration_min })
  }

  const inputStyle = {
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  const hair = services.filter((s) => s.category === 'hair')
  const nails = services.filter((s) => s.category === 'nails')

  const ServiceTable = ({ items, title }: { items: Service[], title: string }) => (
    <div className="mb-8">
      <div
        style={{ color: 'var(--accent)', letterSpacing: '0.14em', borderBottom: '1px solid var(--border)' }}
        className="text-xs font-medium mb-3 pb-3"
      >
        {title}
      </div>
      {items.map((s) => (
        <div
          key={s.id}
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            opacity: s.is_visible ? 1 : 0.5,
          }}
          className="flex items-center justify-between px-5 py-4 rounded-lg mb-2"
        >
          <div>
            <div style={{ color: 'var(--text)' }} className="text-sm font-medium">
              {s.name}
            </div>
            <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
              R{s.price} · {s.duration_min} min
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => toggleVisible(s.id, s.is_visible)}
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              className="text-xs px-3 py-1 rounded-md"
            >
              {s.is_visible ? 'Hide' : 'Show'}
            </button>
            <button
              onClick={() => startEdit(s)}
              style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
              className="text-xs px-3 py-1 rounded-md"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(s.id)}
              style={{ background: '#e85a5a22', color: '#e85a5a', border: '1px solid #e85a5a44' }}
              className="text-xs px-3 py-1 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="p-10">
      <div className="mb-8">
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-4xl font-light mb-2"
        >
          Services
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Add, edit, hide or delete services
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* LEFT — service list */}
        <div className="col-span-2">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm py-12 text-center">
              Loading...
            </div>
          ) : (
            <>
              <ServiceTable items={hair} title="HAIR SERVICES" />
              <ServiceTable items={nails} title="NAIL SERVICES" />
            </>
          )}
        </div>

        {/* RIGHT — add/edit form */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="p-6 rounded-xl h-fit"
        >
          <div
            style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
            className="text-xl mb-6"
          >
            {editing ? 'Edit Service' : 'Add Service'}
          </div>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            SERVICE NAME
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. Knotless Braids"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            CATEGORY
          </label>
          <select
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="hair">Hair</option>
            <option value="nails">Nails</option>
          </select>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            PRICE (R)
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
            placeholder="e.g. 450"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            DURATION (minutes)
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-6"
            placeholder="e.g. 180"
            type="number"
            value={form.duration_min}
            onChange={(e) => setForm({ ...form, duration_min: e.target.value })}
          />

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