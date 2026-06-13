"use client"

import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { FormEvent, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
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
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
        size="lg"
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
