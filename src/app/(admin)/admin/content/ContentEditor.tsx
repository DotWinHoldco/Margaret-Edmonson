'use client'

import { useState } from 'react'

interface ContentField {
  id: string
  page: string
  section: string
  content_key: string
  content_value: string
  content_type: string
  is_active: boolean
}

export default function ContentEditor({ field }: { field: ContentField }) {
  const [value, setValue] = useState(field.content_value)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const isDirty = value !== field.content_value

  async function handleSave() {
    setSaving(true)
    setSaved(false)

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: field.id, content_value: value }),
      })

      if (res.ok) {
        setSaved(true)
        field.content_value = value
        setTimeout(() => setSaved(false), 2000)
      }
    } finally {
      setSaving(false)
    }
  }

  const isLongText =
    field.content_type === 'textarea' ||
    field.content_type === 'html' ||
    value.length > 120

  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <label className="mb-1 block font-body text-xs font-medium text-charcoal/60">
          {field.content_key.replace(/_/g, ' ')}
        </label>
        {isLongText ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={3}
            className="w-full rounded-sm border border-charcoal/15 bg-cream/50 px-3 py-2 font-body text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30 resize-y"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-sm border border-charcoal/15 bg-cream/50 px-3 py-2 font-body text-sm text-charcoal focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal/30"
          />
        )}
      </div>
      <div className="flex items-center gap-2 pt-6">
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-sm bg-teal px-3 py-1.5 font-body text-xs font-medium text-cream transition-colors hover:bg-deep-teal disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        )}
        {saved && (
          <span className="font-body text-xs text-teal">Saved</span>
        )}
      </div>
    </div>
  )
}
