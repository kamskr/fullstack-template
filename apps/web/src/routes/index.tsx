import { Link, createFileRoute } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const session = authClient.useSession()
  const primaryTarget = session.data ? '/timestamps' : '/login'

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-10 sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.32),transparent_66%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_66%)]" />
        <p className="island-kicker mb-3">Template web app</p>
        <h1 className="display-title mb-5 max-w-3xl text-4xl leading-[1.02] font-bold tracking-tight text-[var(--sea-ink)] sm:text-6xl">
          Authenticated CRUD, already wired.
        </h1>
        <p className="mb-8 max-w-2xl text-base text-[var(--sea-ink-soft)] sm:text-lg">
          Better Auth handles sessions. TanStack Query owns server state. The
          timestamp screens consume generated OpenAPI clients and models.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to={primaryTarget} className="demo-button no-underline">
            {session.data ? 'Open timestamps' : 'Login'}
          </Link>
          <Link
            to="/create-account"
            className="demo-button demo-button-secondary no-underline"
          >
            Create account
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['Better Auth', 'Email/password and anonymous sessions via package APIs.'],
          ['Generated client', 'Hey API models and operations stay source-of-truth.'],
          ['TanStack Query', 'List/detail cache invalidation around every mutation.'],
        ].map(([title, desc], index) => (
          <article
            key={title}
            className="island-shell feature-card rise-in rounded-2xl p-5"
            style={{ animationDelay: `${index * 90 + 80}ms` }}
          >
            <h2 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
              {title}
            </h2>
            <p className="m-0 text-sm text-[var(--sea-ink-soft)]">{desc}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
