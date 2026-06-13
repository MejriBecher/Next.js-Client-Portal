"use client"

import { signOut } from "next-auth/react"
import { useCallback } from "react"

export function SignOutButton() {
  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" })
  }, [])

  return (
    <button
      onClick={handleSignOut}
      className="font-body text-[14px] leading-relaxed text-on-surface-variant hover:text-accent-sage transition-colors"
    >
      Sign out
    </button>
  )
}
