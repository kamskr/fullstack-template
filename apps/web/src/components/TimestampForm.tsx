import { useState } from 'react'
import type { TimestampModel } from '@template/api-client'
import {
  fromDateTimeLocalValue,
  toDateTimeLocalValue,
} from '../lib/timestamps'

type TimestampFormProps = {
  submitLabel: string
  timestamp?: TimestampModel
  isPending?: boolean
  onSubmit: (values: { note: string; dateOccurredAt: string }) => void
}

export function TimestampForm({
  submitLabel,
  timestamp,
  isPending,
  onSubmit,
}: TimestampFormProps) {
  const [note, setNote] = useState(timestamp?.note ?? '')
  const [dateOccurredAt, setDateOccurredAt] = useState(
    timestamp
      ? toDateTimeLocalValue(timestamp.dateOccurredAt)
      : toDateTimeLocalValue(new Date().toISOString()),
  )

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ note, dateOccurredAt: fromDateTimeLocalValue(dateOccurredAt) })
      }}
    >
      <label className="grid gap-2 text-sm font-bold text-[var(--sea-ink)]">
        Note
        <textarea
          className="demo-textarea"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Coffee with a clear intent. Shipped a small thing."
          required
        />
      </label>
      <label className="grid gap-2 text-sm font-bold text-[var(--sea-ink)]">
        Occurred at
        <input
          className="demo-input"
          type="datetime-local"
          value={dateOccurredAt}
          onChange={(event) => setDateOccurredAt(event.target.value)}
          required
        />
      </label>
      <button className="demo-button" type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
