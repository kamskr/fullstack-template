import { useState } from 'react'
import type { TimestampModel } from '@template/api-client'

type TimestampFormProps = {
  submitLabel: string
  timestamp?: TimestampModel
  isPending?: boolean
  onSubmit: (values: { note: string }) => void
}

export function TimestampForm({
  submitLabel,
  timestamp,
  isPending,
  onSubmit,
}: TimestampFormProps) {
  const [note, setNote] = useState(timestamp?.note ?? '')

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit({ note })
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
      <button className="demo-button" type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
