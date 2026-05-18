'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { MapPin, Clock, Phone, Mail, MessageCircle, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', contact: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSend = async () => {
    if (!form.name || !form.contact || !form.message) return
    setSending(true)

    const msg = encodeURIComponent(
      `Hi Fhulu! 👋\n\nNew message from your website:\n\n` +
      `Name: ${form.name}\n` +
      `Contact: ${form.contact}\n\n` +
      `Message: ${form.message}`
    )

    window.open(`whatsapp://send?phone=27769068341&text=${msg}`, '_blank')
    setSent(true)
    setSending(false)
  }

  const inputStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  const locations = [
    {
      area: 'Polokwane',
      address: 'Address to be updated',
      hours: 'Mon–Sat: 08:00 – 18:00',
    },
    {
      area: 'Mokopane',
      address: 'Address to be updated',
      hours: 'Mon–Sat: 08:00 – 18:00',
    },
  ]

  return (
    <div>
      {/* HEADER */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
      >
        <p
          style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          className="text-xs mb-3"
        >
          GET IN TOUCH
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          Contact Us
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          Questions about a service, pricing, or availability? Reach out and
          Fhulu will get back to you as soon as possible.
        </p>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* LEFT — info */}
        <div>
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-2xl font-light mb-8"
          >
            Find Us
          </h2>

          {locations.map((l) => (
            <div
              key={l.area}
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              className="p-6 rounded-xl mb-4"
            >
              <div
                style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
                className="text-xs font-medium mb-3"
              >
                {l.area.toUpperCase()}
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 items-start">
                  <MapPin size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: 'var(--text-muted)' }} className="text-sm">
                    {l.address}
                  </span>
                </div>
                <div className="flex gap-3 items-start">
                  <Clock size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: 'var(--text-muted)' }} className="text-sm">
                    {l.hours}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            className="p-6 rounded-xl mb-4"
          >
            <div
              style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
              className="text-xs font-medium mb-3"
            >
              CONTACT
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex gap-3 items-start">
                <Phone size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ color: 'var(--text)' }} className="text-sm">
                    076 906 8341
                  </div>
                  <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                    060 211 9810
                  </div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <Mail size={16} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                <span style={{ color: 'var(--text-muted)' }} className="text-sm">
                  fhulufhelomarubini36@gmail.com
                </span>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/27769068341"
            target="_blank"
            rel="noopener noreferrer"
            style={{ background: '#25D366', color: '#fff' }}
            className="flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-medium hover:opacity-88 transition-opacity"
          >
            <MessageCircle size={20} />
            <div>
              <div className="font-medium">WhatsApp Fhulu directly</div>
              <div className="text-xs opacity-80 mt-0.5">Fastest way to reach her</div>
            </div>
          </a>
        </div>

        {/* RIGHT — message form */}
        <div>
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-2xl font-light mb-8"
          >
            Send a Message
          </h2>

          {sent ? (
            <div
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              className="p-10 rounded-xl text-center"
            >
              <CheckCircle size={40} className="mx-auto mb-4" style={{ color: 'var(--accent)' }} />
              <div
                style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
                className="text-2xl mb-2"
              >
                Message sent!
              </div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">
                Your message was sent to Fhulu via WhatsApp. She'll be in touch soon.
              </p>
            </div>
          ) : (
            <div>
              <label
                style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                className="text-xs font-medium block mb-2"
              >
                YOUR NAME
              </label>
              <input
                style={inputStyle}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <label
                style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                className="text-xs font-medium block mb-2"
              >
                PHONE OR EMAIL
              </label>
              <input
                style={inputStyle}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
                placeholder="How should she reach you back?"
                value={form.contact}
                onChange={(e) => setForm({ ...form, contact: e.target.value })}
              />

              <label
                style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                className="text-xs font-medium block mb-2"
              >
                MESSAGE
              </label>
              <textarea
                style={{ ...inputStyle, resize: 'none' }}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-6 h-32"
                placeholder="Ask about a service, pricing, availability..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <button
                onClick={handleSend}
                disabled={sending}
                style={{ background: 'var(--text)', color: 'var(--bg)' }}
                className="w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50 hover:opacity-82 transition-opacity"
              >
                {sending ? 'Sending...' : 'Send via WhatsApp'}
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}