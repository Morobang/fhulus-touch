'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const FAQS = [
  {
    q: 'Do you supply the hair for braids and locs?',
    a: 'No — clients bring their own hair. This keeps costs down and lets you choose the brand and texture you prefer. If you are unsure what to buy, WhatsApp Fhulu before your appointment and she will advise you.',
  },
  {
    q: 'How far in advance should I book?',
    a: 'At least 2–3 days in advance is recommended, especially for longer services like braids or colour. Same-day bookings are sometimes possible — WhatsApp to check availability.',
  },
  {
    q: 'How long do knotless braids last?',
    a: 'With proper care, knotless braids typically last 6–8 weeks. Sleeping with a satin bonnet and keeping your scalp moisturised will extend the life significantly.',
  },
  {
    q: 'Do you do children\'s hair?',
    a: 'Yes, Fhulu does children\'s hair. Please mention during booking that the appointment is for a child so the right amount of time is allocated.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Cash and EFT are accepted. Payment is due on the day of the appointment.',
  },
  {
    q: 'What happens if I need to cancel?',
    a: 'Please cancel at least 24 hours before your appointment via WhatsApp. Late cancellations may affect future bookings.',
  },
  {
    q: 'Can I bring a style reference?',
    a: 'Absolutely — in fact it is encouraged. Save a photo on your phone and show it at the start of your appointment. This helps Fhulu understand exactly what you want.',
  },
  {
    q: 'Do you offer home visits?',
    a: 'Occasionally — this depends on location and availability. WhatsApp Fhulu directly to discuss.',
  },
  {
    q: 'How long does a gel nail set take?',
    a: 'A full gel set typically takes 1.5 hours. Nail art adds time depending on the design complexity.',
  },
  {
    q: 'I have a sensitive scalp — is that okay?',
    a: 'Yes. Let Fhulu know when booking by adding it to the notes field. She will adjust her technique and products accordingly.',
  },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

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
          QUESTIONS & ANSWERS
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          Frequently Asked Questions
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          Everything you need to know before your appointment.
          Still have a question? WhatsApp Fhulu directly.
        </p>
      </section>

      {/* FAQS */}
      <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-16 max-w-3xl">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            style={{ borderBottom: '1px solid var(--border)' }}
            className="py-5"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between text-left"
            >
              <span
                style={{ color: 'var(--text)' }}
                className="text-sm font-medium pr-8"
              >
                {faq.q}
              </span>
              <span
                style={{
                  color: 'var(--accent)',
                  flexShrink: 0,
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s',
                }}
                className="text-lg"
              >
                {open === i ? '−' : '+'}
              </span>
            </button>

            {open === i && (
              <p
                style={{ color: 'var(--text-muted)' }}
                className="text-sm leading-relaxed mt-4 pr-8"
              >
                {faq.a}
              </p>
            )}
          </div>
        ))}
      </section>

      {/* STILL HAVE QUESTIONS */}
      <section
        style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}
        className="px-4 sm:px-8 lg:px-12 py-10 sm:py-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
      >
        <div>
          <div
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
            className="text-2xl mb-1"
          >
            Still have a question?
          </div>
          <div style={{ color: 'var(--text-muted)' }} className="text-sm">
            Fhulu is available on WhatsApp
          </div>
        </div>
        <a
          href="https://wa.me/27769068341"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: '#25D366', color: '#fff' }}
          className="px-6 py-3 rounded-md text-sm font-medium flex items-center gap-2 hover:opacity-88 transition-opacity"
        >
          <MessageCircle size={16} /> WhatsApp Fhulu
        </a>
      </section>
    </div>
  )
}