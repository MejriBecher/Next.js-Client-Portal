"use client"

import { useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { StatusSwitcher } from "@/components/status-switcher"

type RequestStatus = "PENDING" | "IN_PROGRESS" | "DONE"

export type RequestFormData = {
  title: string
  description: string
  budget: string
  status: RequestStatus
}

export function RequestForm({
  form,
  editingId,
  saving,
  error,
  onFormChange,
  onSubmit,
  onCancel,
}: {
  form: RequestFormData
  editingId: string | null
  saving: boolean
  error: string
  onFormChange: (f: RequestFormData) => void
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}) {
  const set = useCallback(
    (patch: Partial<RequestFormData>) => {
      onFormChange({ ...form, ...patch })
    },
    [form, onFormChange]
  )

  return (
    <form
      onSubmit={onSubmit}
      className="bg-surface-container-lowest rounded-xl border border-border/20 p-8 space-y-5"
    >
      <h2 className="font-display text-[22px] leading-[1.2] text-text-rich">
        {editingId ? "Edit request" : "New request"}
      </h2>

      {error && (
        <div className="bg-state-error/10 border border-state-error/20 rounded-lg px-4 py-3">
          <p className="font-body text-[14px] leading-relaxed text-state-error">
            {error}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <label
          htmlFor="title"
          className="font-label text-[12px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface"
        >
          Title
        </label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => set({ title: e.target.value })}
          required
          placeholder="e.g. Website redesign"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="description"
          className="font-label text-[12px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface"
        >
          Description
        </label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="Describe what you need..."
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="budget"
          className="font-label text-[12px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface"
        >
          Budget (optional)
        </label>
        <Input
          id="budget"
          type="number"
          step="0.01"
          value={form.budget}
          onChange={(e) => set({ budget: e.target.value })}
          placeholder="5000"
        />
      </div>

      {editingId && (
        <div className="space-y-2">
          <label className="font-label text-[12px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface">
            Status
          </label>
          <StatusSwitcher
            current={form.status}
            onChange={(s) => set({ status: s })}
          />
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving
            ? "Saving..."
            : editingId
              ? "Save changes"
              : "Create request"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
