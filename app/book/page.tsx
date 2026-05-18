'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { CheckCircle } from 'lucide-react'

interface Service {
  id: string
  name: string
  category: string
  price: number
  duration_min: number
}

interface Location {
  id: string
  name: string
  area: string
  address: string
}

type Step = 1 | 2 | 3 | 4 | 5

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--text-muted)' }} className="p-12 text-sm">Loading…</div>}>
      <BookingContent />
    </Suspense>
  )
}

function BookingContent() {
  const searchParams = useSearchParams()
  const preselectedService = searchParams.get('service')

  const [step, setStep] = useState<Step>(1)
  const [services, setServices] = useState<Service[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [bookedSlots, setBookedSlots] = useState<string[]>([])

  // form state
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00'
  ]

  useEffect(() => {
    const fetchData = async () => {
      const { data: sData } = await supabase
        .from('services')
        .select('*')
        .eq('is_visible', true)
        .order('category')

      const { data: lData } = await supabase
        .from('locations')
        .select('*')

      if (sData) {
        setServices(sData)
        if (preselectedService) {
          const found = sData.find((s) => s.id === preselectedService)
          if (found) setSelectedService(found)
        }
      }
      if (lData) setLocations(lData)
    }

    fetchData()
  }, [preselectedService])

  useEffect(() => {
    if (!selectedDate || !selectedLocation) return

    const fetchBookedSlots = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('booking_date', selectedDate)
        .eq('location_id', selectedLocation.id)
        .eq('status', 'confirmed')

      if (data) setBookedSlots(data.map((b) => b.booking_time.slice(0, 5)))
    }

    fetchBookedSlots()
  }, [selectedDate, selectedLocation])

  const getDaysInMonth = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    return { daysInMonth, firstDay, today: now.getDate(), year, month }
  }

  const { daysInMonth, firstDay, today, year, month } = getDaysInMonth()

  const monthName = new Date(year, month).toLocaleString('en-ZA', {
    month: 'long',
    year: 'numeric',
  })

  const formatDate = (day: number) => {
    const m = String(month + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    return `${year}-${m}-${d}`
  }

  const formatDuration = (mins: number) => {
    if (mins < 60) return `${mins} min`
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return m > 0 ? `${h}h ${m}min` : `${h}h`
  }

  const handleSubmit = async () => {
    if (!selectedService || !selectedLocation || !selectedDate || !selectedTime || !name || !phone) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    setError('')

    const { error: insertError } = await supabase.from('bookings').insert({
      client_name: name,
      client_phone: phone,
      client_email: email,
      service_id: selectedService.id,
      location_id: selectedLocation.id,
      booking_date: selectedDate,
      booking_time: selectedTime,
      notes,
      status: 'pending',
    })

    if (insertError) {
      setError('Something went wrong. Please try again.')
      setSubmitting(false)
      return
    }

    // send whatsapp notification to fhulu
    const message = encodeURIComponent(
      `🌟 NEW BOOKING — Fhulu's Touch\n\n` +
      `👤 Client: ${name}\n` +
      `📱 Phone: ${phone}\n` +
      `💇 Service: ${selectedService.name}\n` +
      `📍 Location: ${selectedLocation.area}\n` +
      `📅 Date: ${selectedDate}\n` +
      `⏰ Time: ${selectedTime}\n` +
      `${notes ? `📝 Notes: ${notes}` : ''}`
    )

    window.open(`whatsapp://send?phone=27769068341&text=${message}`, '_blank')

    setStep(5)
    setSubmitting(false)
  }

  const StepIndicator = () => (
    <div className="flex items-center gap-0 mb-10">
      {[
        { num: 1, label: 'SERVICE' },
        { num: 2, label: 'LOCATION' },
        { num: 3, label: 'DATE & TIME' },
        { num: 4, label: 'YOUR DETAILS' },
      ].map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              style={{
                background:
                  step > s.num
                    ? 'var(--text)'
                    : step === s.num
                    ? 'var(--accent)'
                    : 'var(--border)',
                color:
                  step > s.num
                    ? 'var(--bg)'
                    : step === s.num
                    ? 'var(--accent-fg)'
                    : 'var(--text-muted)',
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all"
            >
              {step > s.num ? '✓' : s.num}
            </div>
            <div
              style={{
                color: step === s.num ? 'var(--text)' : 'var(--text-muted)',
                letterSpacing: '0.06em',
              }}
              className="text-xs mt-2 hidden sm:block"
            >
              {s.label}
            </div>
          </div>
          {i < 3 && (
            <div
              style={{ background: 'var(--border)' }}
              className="h-px w-16 mb-5 mx-2"
            />
          )}
        </div>
      ))}
    </div>
  )

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
        className="px-4 sm:px-8 lg:px-12 py-12 sm:py-16"
      >
        <p
          style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}
          className="text-xs mb-3"
        >
          BOOK ONLINE
        </p>
        <h1
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          className="text-3xl sm:text-4xl lg:text-5xl font-light mb-4"
        >
          Book an Appointment
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          No account needed — just your name and number
        </p>
      </section>

      <section className="px-4 sm:px-8 lg:px-12 py-10 sm:py-12 w-full max-w-2xl">
        {/* SUCCESS */}
        {step === 5 ? (
          <div className="text-center py-16">
            <CheckCircle size={56} className="mx-auto mb-6" style={{ color: 'var(--accent)' }} />
            <h2
              style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
              className="text-4xl font-light mb-4"
            >
              You're all booked!
            </h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-2">
              A WhatsApp message has been sent to Fhulu with your booking details.
            </p>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm leading-relaxed mb-8">
              She will confirm your appointment shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <a
                href="/"
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                className="px-8 py-3 rounded-md text-sm font-medium"
              >
                Back to Home
              </a>
              <a
                href="/book"
                style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                className="px-8 py-3 rounded-md text-sm"
                onClick={() => {
                  setStep(1)
                  setSelectedService(null)
                  setSelectedLocation(null)
                  setSelectedDate('')
                  setSelectedTime('')
                  setName('')
                  setPhone('')
                  setEmail('')
                  setNotes('')
                }}
              >
                Book Another
              </a>
            </div>
          </div>
        ) : (
          <>
            <StepIndicator />

            {/* STEP 1 — SERVICE */}
            {step === 1 && (
              <div>
                <label
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                  className="text-xs font-medium block mb-4"
                >
                  CHOOSE A SERVICE
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => { setSelectedService(s); setError(''); setStep(2) }}
                      style={{
                        background: 'var(--surface)',
                        border: selectedService?.id === s.id
                          ? '2px solid var(--accent)'
                          : '1px solid var(--border)',
                        textAlign: 'left',
                      }}
                      className="p-4 rounded-xl transition-all hover:border-[var(--accent)] w-full"
                    >
                      <div
                        style={{ fontSize: '10px', color: 'var(--accent)', letterSpacing: '0.1em' }}
                        className="mb-1"
                      >
                        {s.category.toUpperCase()}
                      </div>
                      <div style={{ color: 'var(--text)' }} className="font-medium text-sm mb-1">
                        {s.name}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }} className="text-xs">
                        R{s.price} · {formatDuration(s.duration_min)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — LOCATION */}
            {step === 2 && (
              <div>
                <label
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                  className="text-xs font-medium block mb-4"
                >
                  CHOOSE A LOCATION
                </label>
                <div className="flex flex-col gap-3 mb-6">
                  {locations.map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => { setSelectedLocation(l); setError(''); setStep(3) }}
                      style={{
                        background: 'var(--surface)',
                        border: selectedLocation?.id === l.id
                          ? '2px solid var(--accent)'
                          : '1px solid var(--border)',
                        textAlign: 'left',
                      }}
                      className="p-5 rounded-xl transition-all hover:border-[var(--accent)] w-full"
                    >
                      <div style={{ color: 'var(--text)' }} className="font-medium mb-1">
                        {l.area}
                      </div>
                      <div style={{ color: 'var(--text-muted)' }} className="text-sm">
                        {l.address || 'Address to be confirmed'}
                      </div>
                    </button>
                  ))}
                  {locations.length === 0 && (
                    <div style={{ color: 'var(--text-muted)' }} className="text-sm py-6 text-center">
                      No locations available yet.
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setStep(1)}
                  style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  className="px-6 py-3 rounded-md text-sm"
                >
                  ← Back
                </button>
              </div>
            )}

            {/* STEP 3 — DATE & TIME */}
            {step === 3 && (
              <div>
                <div
                  style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
                  className="text-lg mb-4"
                >
                  {monthName}
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                    <div
                      key={d}
                      style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}
                      className="text-center text-xs py-2"
                    >
                      {d}
                    </div>
                  ))}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const isPast = day < today
                    const dateStr = formatDate(day)
                    const isSelected = selectedDate === dateStr

                    return (
                      <button
                        key={day}
                        disabled={isPast}
                        onClick={() => {
                          setSelectedDate(dateStr)
                          setSelectedTime('')
                        }}
                        style={{
                          background: isSelected ? 'var(--accent)' : 'transparent',
                          color: isPast
                            ? 'var(--border)'
                            : isSelected
                            ? 'var(--accent-fg)'
                            : 'var(--text)',
                        }}
                        className="aspect-square flex items-center justify-center text-sm rounded-lg transition-all hover:bg-[var(--surface)] disabled:cursor-not-allowed"
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                {selectedDate && (
                  <div className="mt-6">
                    <label
                      style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                      className="text-xs font-medium block mb-3"
                    >
                      AVAILABLE TIMES
                    </label>
                    <div className="grid grid-cols-5 gap-2 mb-8">
                      {TIME_SLOTS.map((slot) => {
                        const isTaken = bookedSlots.includes(slot)
                        const isSelected = selectedTime === slot

                        return (
                          <button
                            key={slot}
                            disabled={isTaken}
                            onClick={() => setSelectedTime(slot)}
                            style={{
                              background: isSelected
                                ? 'var(--accent)'
                                : isTaken
                                ? 'var(--bg-secondary)'
                                : 'var(--surface)',
                              color: isSelected
                                ? 'var(--accent-fg)'
                                : isTaken
                                ? 'var(--border)'
                                : 'var(--text)',
                              border: '1px solid var(--border)',
                              textDecoration: isTaken ? 'line-through' : 'none',
                            }}
                            className="py-2 rounded-lg text-sm transition-all disabled:cursor-not-allowed"
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                    className="px-6 py-3 rounded-md text-sm"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => {
                      if (!selectedDate || !selectedTime) {
                        setError('Please pick a date and time.')
                        return
                      }
                      setError('')
                      setStep(4)
                    }}
                    style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                    className="px-8 py-3 rounded-md text-sm font-medium"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — DETAILS */}
            {step === 4 && (
              <div>
                {/* SUMMARY */}
                <div
                  style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  className="p-5 rounded-xl mb-8"
                >
                  <div
                    style={{ color: 'var(--accent)', letterSpacing: '0.1em' }}
                    className="text-xs mb-3"
                  >
                    BOOKING SUMMARY
                  </div>
                  {[
                    { label: 'Service', value: `${selectedService?.name} — R${selectedService?.price}` },
                    { label: 'Location', value: selectedLocation?.area },
                    { label: 'Date', value: selectedDate },
                    { label: 'Time', value: selectedTime },
                  ].map((row) => (
                    <div
                      key={row.label}
                      style={{ borderBottom: '1px solid var(--border)' }}
                      className="flex justify-between py-2 text-sm last:border-b-0"
                    >
                      <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                      <span style={{ color: 'var(--text)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <label
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                  className="text-xs font-medium block mb-2"
                >
                  FULL NAME *
                </label>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <input
                    style={inputStyle}
                    className="px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="First name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <input
                    style={inputStyle}
                    className="px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="Last name"
                  />
                </div>

                <label
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                  className="text-xs font-medium block mb-2"
                >
                  PHONE NUMBER *
                </label>
                <input
                  style={inputStyle}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] mb-4"
                  placeholder="e.g. 072 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                />

                <label
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                  className="text-xs font-medium block mb-2"
                >
                  EMAIL ADDRESS
                </label>
                <input
                  style={inputStyle}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] mb-4"
                  placeholder="Optional"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />

                <label
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}
                  className="text-xs font-medium block mb-2"
                >
                  NOTES FOR FHULU
                  <span style={{ color: 'var(--text-muted)', fontWeight: 300 }}> (optional)</span>
                </label>
                <textarea
                  style={{ ...inputStyle, resize: 'none' }}
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none focus:border-[var(--accent)] mb-6 h-24"
                  placeholder="Hair type, allergies, style reference, anything she should know..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />

                {error && (
                  <div
                    style={{ color: '#e85a5a', background: 'rgba(232,90,90,0.1)', border: '1px solid rgba(232,90,90,0.2)' }}
                    className="px-4 py-3 rounded-lg text-sm mb-4"
                  >
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                    className="px-6 py-3 rounded-md text-sm"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{ background: 'var(--text)', color: 'var(--bg)' }}
                    className="px-8 py-3 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {submitting ? 'Confirming...' : '✓ Confirm Booking'}
                  </button>
                </div>
              </div>
            )}

            {error && step !== 4 && (
              <div
                style={{ color: '#e85a5a' }}
                className="text-sm mt-3"
              >
                {error}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  )
}