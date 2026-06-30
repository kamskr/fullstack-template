import { Link } from '@tanstack/react-router'
import { authClient } from '../lib/auth-client'

export function AuthGate({ children }: { children: React.ReactNode }) {
  const session = authClient.useSession()

  if (session.isPending) {
    return (
      <main className="demo-page demo-center">
        <div className="demo-panel max-w-md text-center">
          <p className="island-kicker mb-3">Checking session</p>
          <h1 className="demo-title">Finding your workspace…</h1>
        </div>
      </main>
    )
  }

  if (!session.data) {
    return (
      <main className="demo-page demo-center">
        <section className="demo-panel max-w-lg text-center">
          <p className="island-kicker mb-3">Private demo</p>
          <h1 className="demo-title mb-4">Sign in to work with timestamps.</h1>
          <p className="demo-muted mb-6">
            This screen uses Better Auth sessions and the generated OpenAPI
            client. No hand-rolled auth fetches.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/login" className="demo-button no-underline">
              Login
            </Link>
            <Link
              to="/create-account"
              className="demo-button demo-button-secondary no-underline"
            >
              Create account
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return children
}
