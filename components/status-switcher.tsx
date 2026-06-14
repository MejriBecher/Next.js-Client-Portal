"use client"

import { Button } from "@/components/ui/button"

type RequestStatus = "PENDING" | "IN_PROGRESS" | "DONE"

const nextStatus: Record<RequestStatus, RequestStatus[]> = {
  PENDING: ["IN_PROGRESS", "DONE"],
  IN_PROGRESS: ["DONE"],
  DONE: [],
}

const statusLabels: Record<RequestStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
}

export function StatusSwitcher({
  current,
  onChange,
}: {
  current: RequestStatus
  onChange: (s: RequestStatus) => void
}) {
  if (current === "DONE") {
    return (
      <div className="px-4 py-3 rounded-lg border border-border/20 bg-surface-container-low">
        <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">
          This request is <strong className="text-text-rich">Done</strong> and cannot be
          reopened. If you need additional work, create a new request.
        </p>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      {[current, ...nextStatus[current]].map((s) => (
        <Button
          key={s}
          type="button"
          variant={current === s ? "default" : "outline"}
          size="sm"
          onClick={() => onChange(s)}
          disabled={s === current}
          className="flex-1"
        >
          {statusLabels[s]}
        </Button>
      ))}
    </div>
  )
}
