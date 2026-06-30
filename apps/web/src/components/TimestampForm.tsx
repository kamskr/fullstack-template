import { createTimestampFormSchema } from '@template/validators'
import type { TimestampModel } from '@template/api-client'
import { useForm } from 'react-hook-form'
import type { TimestampFormValues } from '@template/validators'

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
  const { handleSubmit, register } = useForm<TimestampFormValues>({
    defaultValues: { note: timestamp?.note ?? '' },
  })

  return (
    <form
      className="grid gap-4"
      onSubmit={handleSubmit((values) => {
        onSubmit(createTimestampFormSchema.parse(values))
      })}
    >
      <label className="grid gap-2 text-sm font-bold text-[var(--sea-ink)]">
        Note
        <textarea
          className="demo-textarea"
          {...register('note')}
          placeholder="Coffee with a clear intent. Shipped a small thing."
        />
      </label>
      <button className="demo-button" type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
