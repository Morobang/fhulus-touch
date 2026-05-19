'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { ChevronDown, MessageCircle } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState<string | null>(null)

  useEffect(() => {
    const fetchFAQs = async () => {
      const { data } = await supabase
        .from('faqs')
        .select('id, question, answer')
        .eq('is_visible', true)
        .order('sort_order')
        .order('created_at')
      if (data) setFaqs(data)
      setLoading(false)
    }
    fetchFAQs()
  }, [])

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

      {/* ACCORDION */}
      <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-14 max-w-2xl">
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm py-16 text-center">
            Loading...
          </div>
        ) : faqs.length === 0 ? (
          <div style={{ color: 'var(--text-muted)' }} className="text-sm py-16 text-center">
            No FAQs yet — check back soon.
          </div>
        ) : (
          <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {faqs.map((faq, i) => (
              <div
                key={faq.id}
                style={{ borderTop: i > 0 ? '1px solid var(--border)' : undefined }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  style={{ background: open === faq.id ? 'var(--surface)' : 'var(--bg)' }}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--surface)]"
                >
                  <span style={{ color: 'var(--text)' }} className="text-sm font-medium leading-snug">
                    {faq.question}
                  </span>
                  <ChevronDown
                    size={16}
                    style={{
                      color: 'var(--accent)',
                      flexShrink: 0,
                      transform: open === faq.id ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}
                  />
                </button>
                {open === faq.id && (
                  <div
                    style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
                    className="px-5 py-4"
                  >
                    <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <div
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          className="mt-8 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between"
        >
          <div>
            <div style={{ color: 'var(--text)' }} className="text-sm font-medium mb-1">Still have a question?</div>
            <div style={{ color: 'var(--text-muted)' }} className="text-xs">Fhulu usually replies within the hour.</div>
          </div>
          <a
            href={`whatsapp://send?phone=27769068341&text=${encodeURIComponent("Hi Fhulu! 👋 I have a question about booking at Fhulu's Touch.")}`}
            style={{ background: '#25D366', color: '#fff' }}
            className="px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap flex-shrink-0"
          >
            <MessageCircle size={15} />
            WhatsApp Fhulu
          </a>
        </div>
      </section>
    </div>
  )
}
