'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Copy, Check } from 'lucide-react'

export default function ReviewPage() {
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('https://fhulus-touch.vercel.app/review')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Please enter your name.'); return }
    if (!content.trim()) { setError('Please write a short review.'); return }

    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('testimonials').insert({
      client_name: name.trim(),
      content: content.trim(),
      rating,
      is_approved: false,
    })

    if (insertError) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    setDone(true)
    setSubmitting(false)
  }

  const inputStyle = {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  }

  return (
    <div>
      {/* HEADER */}
      <section
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
        className="px-4 sm:px-8 py-10 sm:py-14"
      >
        <p
          style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          className="text-xs mb-3"
        >
          FHULU'S TOUCH
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl font-light mb-3"
        >
          Leave a Review
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-md leading-relaxed">
          How was your experience? Your feedback helps Fhulu grow and helps other clients know what to expect.
        </p>
      </section>

      <section className="px-4 sm:px-8 py-10 sm:py-14 max-w-lg">
        {done ? (
          <div className="text-center py-10">
            <CheckCircle size={52} className="mx-auto mb-6" style={{ color: 'var(--accent)' }} />
            <h2
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              className="text-3xl font-light mb-4"
            >
              Thank you so much! 💛
            </h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-8">
              Your review has been submitted and will appear on the site once approved. Fhulu really appreciates it!
            </p>

            {/* REFERRAL */}
            <div
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              className="rounded-xl px-5 py-5 mb-8 text-left"
            >
              <div style={{ color: 'var(--text)' }} className="text-sm font-medium mb-1">
                Know someone who&rsquo;d love Fhulu&rsquo;s Touch?
              </div>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mb-4 leading-relaxed">
                Share the review link — help a friend find a great stylist.
              </p>
              <div className="flex gap-2">
                <div
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  className="flex-1 px-3 py-2 rounded-lg text-xs truncate"
                >
                  https://fhulus-touch.vercel.app/review
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    background: copied ? '#25D36622' : 'var(--accent)',
                    color: copied ? '#25D366' : 'var(--accent-fg)',
                    border: copied ? '1px solid #25D36644' : 'none',
                  }}
                  className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-colors"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <a
              href="/"
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              className="inline-block px-8 py-3 rounded-lg text-sm font-medium"
            >
              Back to Home
            </a>
          </div>
        ) : (
          <div>
            {/* STAR RATING */}
            <p style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs font-medium mb-3">
              YOUR RATING
            </p>
            <div className="flex gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  className="text-4xl transition-transform hover:scale-110"
                  style={{ color: star <= (hovered || rating) ? '#f0a500' : 'var(--border)' }}
                >
                  ★
                </button>
              ))}
            </div>

            <p style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs font-medium mb-2">
              YOUR NAME *
            </p>
            <input
              style={inputStyle}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] mb-6"
              placeholder="e.g. Thandi M."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <p style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs font-medium mb-2">
              YOUR REVIEW *
            </p>
            <textarea
              style={{ ...inputStyle, resize: 'none' }}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] mb-6 h-32"
              placeholder="Tell us about your experience — what did you get done? What did you love?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            {error && (
              <div
                style={{ color: '#e85a5a', background: 'rgba(232,90,90,0.08)', border: '1px solid rgba(232,90,90,0.2)' }}
                className="px-4 py-3 rounded-lg text-sm mb-4"
              >
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              className="w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
