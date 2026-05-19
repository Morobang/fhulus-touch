'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Pencil, Trash2, Eye, EyeOff, CheckCircle } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  sort_order: number
  is_visible: boolean
}

const EMPTY = { question: '', answer: '' }

export default function AdminFAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const fetchFAQs = async () => {
    const { data, error: fetchError } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order')
      .order('created_at')
    if (fetchError) setError('Could not load FAQs: ' + fetchError.message)
    if (data) setFaqs(data)
    setLoading(false)
  }

  useEffect(() => { fetchFAQs() }, [])

  const handleSave = async () => {
    if (!form.question.trim()) { setError('Question is required.'); return }
    if (!form.answer.trim()) { setError('Answer is required.'); return }

    setSaving(true)
    setError('')
    setSaved(false)

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      sort_order: editing ? undefined : faqs.length,
    }

    const { error: dbError } = editing
      ? await supabase.from('faqs').update(payload).eq('id', editing)
      : await supabase.from('faqs').insert({ ...payload, sort_order: faqs.length })

    if (dbError) { setError('Save failed: ' + dbError.message); setSaving(false); return }

    setForm(EMPTY)
    setEditing(null)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    fetchFAQs()
  }

  const toggleVisible = async (id: string, current: boolean) => {
    await supabase.from('faqs').update({ is_visible: !current }).eq('id', id)
    fetchFAQs()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    await supabase.from('faqs').delete().eq('id', id)
    fetchFAQs()
  }

  const startEdit = (f: FAQ) => {
    setEditing(f.id)
    setError('')
    setSaved(false)
    setForm({ question: f.question, answer: f.answer })
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
          FAQ
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Manage frequently asked questions shown on the FAQ page
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT — list */}
        <div className="lg:col-span-2">
          {loading ? (
            <div style={{ color: 'var(--text-muted)' }} className="text-sm py-12 text-center">Loading...</div>
          ) : faqs.length === 0 ? (
            <div
              style={{ border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
              className="rounded-xl py-12 text-center text-sm"
            >
              No FAQs yet — add your first one using the form.
            </div>
          ) : (
            <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {faqs.map((f, i) => (
                <div
                  key={f.id}
                  onClick={() => startEdit(f)}
                  style={{
                    background: editing === f.id ? 'color-mix(in srgb, var(--accent) 8%, var(--surface))' : 'var(--surface)',
                    borderTop: i > 0 ? '1px solid var(--border)' : undefined,
                    borderLeft: editing === f.id ? '3px solid var(--accent)' : '3px solid transparent',
                    opacity: f.is_visible ? 1 : 0.5,
                    cursor: 'pointer',
                  }}
                  className="flex items-start justify-between gap-3 px-4 py-4 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div style={{ color: 'var(--text)' }} className="text-sm font-medium mb-1 pr-2">
                      {f.question}
                    </div>
                    <div style={{ color: 'var(--text-muted)' }} className="text-xs line-clamp-2">
                      {f.answer}
                    </div>
                    {!f.is_visible && (
                      <span style={{ color: 'var(--accent)' }} className="text-xs">hidden</span>
                    )}
                  </div>
                  <div className="flex gap-1 flex-shrink-0 mt-0.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleVisible(f.id, f.is_visible)}
                      style={{ color: 'var(--text-muted)' }}
                      className="p-1.5 rounded hover:text-[var(--text)] transition-colors"
                    >
                      {f.is_visible ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
                      style={{ color: '#e85a5a' }}
                      className="p-1.5 rounded"
                    >
                      <Trash2 size={13} />
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
          className="p-6 rounded-xl h-fit lg:sticky lg:top-6"
        >
          <div
            style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
            className="text-xl mb-6 flex items-center gap-2"
          >
            {editing ? <Pencil size={18} /> : <Plus size={18} />}
            {editing ? 'Edit Question' : 'Add Question'}
          </div>

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            QUESTION *
          </label>
          <input
            style={inputStyle}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4 focus:border-[var(--accent)]"
            placeholder="e.g. How long does knotless braids take?"
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
          />

          <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
            ANSWER *
          </label>
          <textarea
            style={{ ...inputStyle, resize: 'none' }}
            className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-6 h-32 focus:border-[var(--accent)]"
            placeholder="Give a clear, helpful answer..."
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
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
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Question'}
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
