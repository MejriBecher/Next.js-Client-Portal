"use client"

import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState, useCallback } from "react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setLoading(true)
      setError("")

      const form = new FormData(e.currentTarget)
      const email = form.get("email") as string
      const password = form.get("password") as string

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setLoading(false)
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    },
    [router, callbackUrl]
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-state-error/10 border border-state-error/20 rounded-lg px-4 py-3">
          <p className="font-body text-[14px] leading-relaxed text-state-error">
            {error}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="font-label text-[12px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-lg border border-border bg-surface-cream font-body text-[16px] leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-sage focus:border-accent-sage transition-all"
          placeholder="you@agency.com"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="font-label text-[12px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-lg border border-border bg-surface-cream font-body text-[16px] leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-sage focus:border-accent-sage transition-all"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent-sage text-white py-3.5 rounded-lg font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}
