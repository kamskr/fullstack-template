import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { authClient } from '../lib/auth-client'

export const Route = createFileRoute('/create-account')({
  component: CreateAccountRoute,
})

function CreateAccountRoute() {
  const navigate = useNavigate()
  const session = authClient.useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsPending(true)
    setError(null)
    const result = await authClient.signUp.email({ name, email, password })
    setIsPending(false)
    if (result.error) {
      setError(result.error.message ?? 'Could not create account.')
      return
    }
    await navigate({ to: '/timestamps' })
  }

  return (
    <main className="demo-page demo-center">
      <section className="demo-panel w-full max-w-lg">
        <p className="island-kicker mb-3">Permanent workspace</p>
        <h1 className="demo-title mb-3">Create account</h1>
        <p className="demo-muted mb-6">
          {session.data?.user.isAnonymous
            ? 'You are anonymous now. Signup links this session and transfers your timestamps.'
            : 'Create an email/password account backed by Better Auth.'}
        </p>
        {error ? <p className="demo-alert demo-alert-danger">{error}</p> : null}
        <form className="mt-5 grid gap-4" onSubmit={submit}>
          <label className="grid gap-2 text-sm font-bold">
            Name
            <input
              className="demo-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
            />
          </label>
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
              autoComplete="new-password"
              minLength={8}
              required
            />
          </label>
          <button className="demo-button" type="submit" disabled={isPending}>
            {isPending ? 'Creating…' : 'Create account'}
          </button>
        </form>
        <p className="demo-muted mt-5 text-sm">
          Already have one? <Link to="/login">Login</Link>.
        </p>
      </section>
    </main>
  )
}
