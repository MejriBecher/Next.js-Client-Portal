"use client"

import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="text-center py-24">
      <p className="font-display text-[22px] leading-[1.2] text-state-error">
        Something went wrong
      </p>
      <p className="font-body text-[16px] leading-relaxed text-on-surface-variant mt-2 mb-6">
        {error.message || "Could not load the dashboard. Please try again."}
      </p>
      <Button onClick={reset}>
        Try again
      </Button>
    </div>
  )
}
