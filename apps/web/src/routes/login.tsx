import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/login')({ component: LoginRoute })

function LoginRoute() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)
    const result = await authClient.signIn.email({ email, password })
    setIsPending(false)
    if (result.error) {
      setError(result.error.message ?? 'Could not sign in.')
      return
    }
    await navigate({ to: '/timestamps' })
  }

  async function submitAnonymous() {
    setIsPending(true)
    setError(null)
    const result = await authClient.signIn.anonymous()
    setIsPending(false)
    if (result.error) {
      setError(result.error.message ?? 'Could not start anonymous session.')
      return
    }
    await navigate({ to: '/timestamps' })
  }

  return (
    <main className="demo-page demo-center">
      <section className="demo-panel w-full max-w-lg">
        <p className="island-kicker mb-3">Welcome back</p>
        <h1 className="demo-title mb-3">Login</h1>
        <p className="demo-muted mb-6">
          Use a real account or start anonymously. Both go through Better Auth.
        </p>
        {error ? <p className="demo-alert demo-alert-danger">{error}</p> : null}
        <form className="mt-5 grid gap-4" onSubmit={submitEmail}>
          <label className="grid gap-2 text-sm font-bold">
            Email
            <input
              className="demo-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </label>
          <label className="grid gap-2 text-sm font-bold">
            Password
            <input
              className="demo-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <button className="demo-button" type="submit" disabled={isPending}>
            {isPending ? 'Signing in…' : 'Login'}
          </button>
        </form>
        <div className="my-5 h-px bg-[var(--line)]" />
        <button
          className="demo-button demo-button-secondary w-full"
          type="button"
          disabled={isPending}
          onClick={() => void submitAnonymous()}
        >
          Continue anonymously
        </button>
        <p className="demo-muted mt-5 text-sm">
          Need an account? <Link to="/create-account">Create one</Link>.
        </p>
      </section>
    </main>
  )
}
