import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { AuthGate } from '../components/AuthGate'
import { TimestampForm } from '../components/TimestampForm'
import {
  createTimestamp,
  deleteTimestamp,
  listTimestamps,
  timestampKeys,
} from '../lib/timestamps'

export const Route = createFileRoute('/timestamps')({
  component: TimestampsRoute,
})

function TimestampsRoute() {
  const queryClient = useQueryClient()
  const timestampsQuery = useQuery({
    queryKey: timestampKeys.all,
    queryFn: listTimestamps,
  })
  const createMutation = useMutation({
    mutationFn: createTimestamp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: timestampKeys.all })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteTimestamp,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: timestampKeys.all })
    },
  })

  return (
    <AuthGate>
      <main className="demo-page demo-page-wide">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.35fr]">
          <section className="demo-panel h-fit">
            <p className="island-kicker mb-3">Create</p>
            <h1 className="demo-title mb-4">New timestamp</h1>
            <TimestampForm
              submitLabel="Create timestamp"
              isPending={createMutation.isPending}
              onSubmit={(values) =>
                createMutation.mutate({
                  ...values,
                  dateOccurredAt: new Date().toISOString(),
                })
              }
            />
            {createMutation.error ? (
              <p className="demo-alert demo-alert-danger mt-4">
                Could not create timestamp.
              </p>
            ) : null}
          </section>

          <section className="demo-panel">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="island-kicker mb-3">Read list</p>
                <h2 className="demo-title">Timestamps</h2>
              </div>
              <button
                className="demo-button demo-button-secondary"
                type="button"
                onClick={() => void timestampsQuery.refetch()}
              >
                Refresh
              </button>
            </div>

            {timestampsQuery.isLoading ? (
              <p className="demo-muted">Loading timestamps…</p>
            ) : null}
            {timestampsQuery.error ? (
              <p className="demo-alert demo-alert-danger">
                Could not load timestamps. Check API/session.
              </p>
            ) : null}
            {timestampsQuery.data?.length === 0 ? (
              <div className="demo-alert">
                No timestamps yet. Create one from the form on the left.
              </div>
            ) : null}
            <div className="grid gap-3">
              {timestampsQuery.data?.map((timestamp) => (
                <article className="demo-list-item" key={timestamp.id}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="m-0 font-bold text-[var(--sea-ink)]">
                        {timestamp.note}
                      </p>
                      <p className="demo-muted m-0 mt-2 text-sm">
                        {new Intl.DateTimeFormat(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        }).format(new Date(timestamp.dateOccurredAt))}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to="/timestamps/$timestampId"
                        params={{ timestampId: timestamp.id }}
                        className="demo-button demo-button-secondary no-underline"
                      >
                        Details
                      </Link>
                      <button
                        className="demo-button demo-button-danger"
                        type="button"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(timestamp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </AuthGate>
  )
}
