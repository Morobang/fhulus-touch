'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface AvailabilityRow {
  id?: string
  location_id: string
  day_of_week: number
  open_time: string
  close_time: string
  is_closed: boolean
}

interface Location {
  id: string
  area: string
}

interface BlockedDate {
  id: string
  location_id: string
  blocked_date: string
  reason: string
}

export default function AdminAvailability() {
  const [locations, setLocations] = useState<Location[]>([])
  const [selectedLocation, setSelectedLocation] = useState<string>('')
  const [availability, setAvailability] = useState<AvailabilityRow[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase.from('locations').select('*')
      if (data) {
        setLocations(data)
        if (data.length > 0) setSelectedLocation(data[0].id)
      }
    }
    fetchLocations()
  }, [])

  useEffect(() => {
    if (!selectedLocation) return
    fetchAvailability()
    fetchBlockedDates()
  }, [selectedLocation])

  const fetchAvailability = async () => {
    const { data } = await supabase
      .from('availability')
      .select('*')
      .eq('location_id', selectedLocation)
      .order('day_of_week')

    if (data && data.length > 0) {
      setAvailability(data)
    } else {
      // seed default rows
      const defaults = DAYS.map((_, i) => ({
        location_id: selectedLocation,
        day_of_week: i,
        open_time: '08:00',
        close_time: '18:00',
        is_closed: i === 0,
      }))
      setAvailability(defaults)
    }
  }

  const fetchBlockedDates = async () => {
    const { data } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('location_id', selectedLocation)
      .order('blocked_date')
    if (data) setBlockedDates(data)
  }

  const updateRow = (index: number, field: string, value: any) => {
    setAvailability((prev) =>
      prev.map((row, i) => i === index ? { ...row, [field]: value } : row)
    )
  }

  const saveAvailability = async () => {
    setSaving(true)

    for (const row of availability) {
      if (row.id) {
        await supabase
          .from('availability')
          .update({
            open_time: row.open_time,
            close_time: row.close_time,
            is_closed: row.is_closed,
          })
          .eq('id', row.id)
      } else {
        await supabase.from('availability').insert(row)
      }
    }

    setSaving(false)
    fetchAvailability()
  }

  const addBlockedDate = async () => {
    if (!newBlockDate) return
    await supabase.from('blocked_dates').insert({
      location_id: selectedLocation,
      blocked_date: newBlockDate,
      reason: newBlockReason,
    })
    setNewBlockDate('')
    setNewBlockReason('')
    fetchBlockedDates()
  }

  const removeBlockedDate = async (id: string) => {
    await supabase.from('blocked_dates').delete().eq('id', id)
    fetchBlockedDates()
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
          Availability
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          Set working hours and block off days per location
        </p>
      </div>

      {/* LOCATION SELECTOR */}
      <div className="flex gap-3 mb-8">
        {locations.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedLocation(l.id)}
            style={{
              background: selectedLocation === l.id ? 'var(--accent)' : 'var(--surface)',
              color: selectedLocation === l.id ? 'var(--accent-fg)' : 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}
            className="px-5 py-2 rounded-full text-sm transition-all"
          >
            {l.area}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* WORKING HOURS */}
        <div className="col-span-2">
          <div
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            className="rounded-xl overflow-hidden mb-6"
          >
            <div
              style={{ borderBottom: '1px solid var(--border)' }}
              className="px-6 py-4 flex justify-between items-center"
            >
              <div style={{ color: 'var(--text)' }} className="font-medium">
                Working Hours
              </div>
              <button
                onClick={saveAvailability}
                disabled={saving}
                style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
                className="px-5 py-2 rounded-md text-xs font-medium disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Hours'}
              </button>
            </div>

            <div className="p-6">
              {availability.map((row, i) => (
                <div
                  key={i}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    opacity: row.is_closed ? 0.5 : 1,
                  }}
                  className="flex items-center gap-6 py-4 last:border-b-0"
                >
                  <div
                    style={{ color: 'var(--text)', minWidth: '100px' }}
                    className="text-sm font-medium"
                  >
                    {DAYS[row.day_of_week]}
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => updateRow(i, 'is_closed', !row.is_closed)}
                      style={{
                        background: row.is_closed ? '#e85a5a' : '#25D366',
                        width: '36px',
                        height: '20px',
                        borderRadius: '10px',
                        position: 'relative',
                        transition: 'background 0.2s',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: row.is_closed ? '2px' : '18px',
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          background: '#fff',
                          transition: 'left 0.2s',
                        }}
                      />
                    </div>
                    <span style={{ color: 'var(--text-muted)' }} className="text-xs">
                      {row.is_closed ? 'Closed' : 'Open'}
                    </span>
                  </label>

                  {!row.is_closed && (
                    <>
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs">From</span>
                        <input
                          type="time"
                          style={inputStyle}
                          className="px-3 py-2 rounded-lg text-sm outline-none"
                          value={row.open_time}
                          onChange={(e) => updateRow(i, 'open_time', e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: 'var(--text-muted)' }} className="text-xs">To</span>
                        <input
                          type="time"
                          style={inputStyle}
                          className="px-3 py-2 rounded-lg text-sm outline-none"
                          value={row.close_time}
                          onChange={(e) => updateRow(i, 'close_time', e.target.value)}
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BLOCKED DATES */}
        <div>
          <div
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            className="rounded-xl p-6 mb-4"
          >
            <div
              style={{ color: 'var(--text)', fontFamily: 'var(--font-serif)' }}
              className="text-xl mb-6"
            >
              Block a Date
            </div>

            <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
              DATE
            </label>
            <input
              type="date"
              style={inputStyle}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
              value={newBlockDate}
              onChange={(e) => setNewBlockDate(e.target.value)}
            />

            <label style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs block mb-2">
              REASON <span style={{ fontWeight: 300 }}>(optional)</span>
            </label>
            <input
              style={inputStyle}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none mb-4"
              placeholder="e.g. Public holiday"
              value={newBlockReason}
              onChange={(e) => setNewBlockReason(e.target.value)}
            />

            <button
              onClick={addBlockedDate}
              style={{ background: 'var(--accent)', color: 'var(--accent-fg)' }}
              className="w-full py-3 rounded-lg text-sm font-medium"
            >
              Block Date
            </button>
          </div>

          {/* BLOCKED LIST */}
          {blockedDates.length > 0 && (
            <div
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              className="rounded-xl p-4"
            >
              <div style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }} className="text-xs mb-3">
                BLOCKED DATES
              </div>
              {blockedDates.map((b) => (
                <div
                  key={b.id}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  className="flex items-center justify-between py-3 last:border-b-0"
                >
                  <div>
                    <div style={{ color: 'var(--text)' }} className="text-sm">
                      {b.blocked_date}
                    </div>
                    {b.reason && (
                      <div style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">
                        {b.reason}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => removeBlockedDate(b.id)}
                    style={{ color: '#e85a5a' }}
                    className="text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}