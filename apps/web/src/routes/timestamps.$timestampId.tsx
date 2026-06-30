import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { AuthGate } from '../components/AuthGate'
import { TimestampForm } from '../components/TimestampForm'
import {
  deleteTimestamp,
  getTimestamp,
  timestampKeys,
  updateTimestamp,
} from '../lib/timestamps'

export const Route = createFileRoute('/timestamps/$timestampId')({
  component: TimestampDetailRoute,
})

function TimestampDetailRoute() {
  const { timestampId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const timestampQuery = useQuery({
    queryKey: timestampKeys.detail(timestampId),
    queryFn: () => getTimestamp(timestampId),
  })
  const updateMutation = useMutation({
    mutationFn: (values: { note: string; dateOccurredAt: string }) =>
      updateTimestamp(timestampId, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: timestampKeys.all }),
        queryClient.invalidateQueries({
          queryKey: timestampKeys.detail(timestampId),
        }),
      ])
    },
  })
  const deleteMutation = useMutation({
    mutationFn: () => deleteTimestamp(timestampId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: timestampKeys.all })
      await navigate({ to: '/timestamps' })
    },
  })

  return (
    <AuthGate>
      <main className="demo-page">
        <Link to="/timestamps" className="demo-pill no-underline">
          ← Back to list
        </Link>

        {timestampQuery.isLoading ? (
          <section className="demo-panel mt-5">
            <p className="demo-muted">Loading timestamp…</p>
          </section>
        ) : null}

        {timestampQuery.error ? (
          <section className="demo-panel mt-5">
            <p className="demo-alert demo-alert-danger">
              Could not load timestamp.
            </p>
          </section>
        ) : null}

        {timestampQuery.data ? (
          <section className="demo-panel mt-5">
            <p className="island-kicker mb-3">Read details / edit / delete</p>
            <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <h1 className="demo-title mb-3">Timestamp detail</h1>
                <p className="demo-muted m-0">
                  Created{' '}
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  }).format(new Date(timestampQuery.data.createdAt))}
                </p>
              </div>
              <button
                className="demo-button demo-button-danger"
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate()}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>

            <div className="mb-6 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--chip-bg)] p-4">
              <p className="m-0 font-bold">{timestampQuery.data.note}</p>
              <p className="demo-muted m-0 text-sm">
                Occurred{' '}
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }).format(new Date(timestampQuery.data.dateOccurredAt))}
              </p>
              <code>{timestampQuery.data.id}</code>
            </div>

            <TimestampForm
              key={timestampQuery.data.id + timestampQuery.data.updatedAt}
              timestamp={timestampQuery.data}
              submitLabel="Save changes"
              isPending={updateMutation.isPending}
              onSubmit={(values) => updateMutation.mutate(values)}
            />
            {updateMutation.error ? (
              <p className="demo-alert demo-alert-danger mt-4">
                Could not update timestamp.
              </p>
            ) : null}
          </section>
        ) : null}
      </main>
    </AuthGate>
  )
}
