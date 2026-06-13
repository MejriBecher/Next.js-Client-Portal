"use client"

import { useState, useCallback, useOptimistic, startTransition } from "react"

type RequestStatus = "PENDING" | "IN_PROGRESS" | "DONE"

type RequestItem = {
  id: string
  title: string
  description: string | null
  budget: string | null
  status: RequestStatus
  userId: string
  createdAt: string
  updatedAt: string
}

type FormState = {
  title: string
  description: string
  budget: string
  status: RequestStatus
}

const emptyForm: FormState = {
  title: "",
  description: "",
  budget: "",
  status: "PENDING",
}

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

const statusStyles: Record<RequestStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
  IN_PROGRESS: "bg-accent-sage/10 text-accent-sage border-accent-sage/20",
  DONE: "bg-surface-container-high text-on-surface-variant border-border",
}

export function DashboardRequests({
  initialRequests,
}: {
  initialRequests: RequestItem[]
}) {
  const [requests, setRequests] = useState<RequestItem[]>(initialRequests)
  const [optimisticRequests, addOptimistic] = useOptimistic(
    requests,
    (state, action: { type: string; request: RequestItem }) => {
      if (action.type === "delete") {
        return state.filter((r) => r.id !== action.request.id)
      }
      return state
    }
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const resetForm = useCallback(() => {
    setForm(emptyForm)
    setShowForm(false)
    setEditingId(null)
    setError("")
    setSaving(false)
  }, [])

  const serializeForm = useCallback((f: FormState) => ({
    title: f.title,
    description: f.description || undefined,
    budget: f.budget ? Number(f.budget) : null,
    status: f.status,
  }), [])

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setSaving(true)
      setError("")

      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serializeForm(form)),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to create request")
        setSaving(false)
        return
      }

      setRequests((prev) => [
        {
          ...data,
          budget: data.budget ? data.budget.toString() : null,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
        ...prev,
      ])
      resetForm()
    },
    [form, resetForm, serializeForm]
  )

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!editingId) return
      setSaving(true)
      setError("")

      const res = await fetch(`/api/requests/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(serializeForm(form)),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Failed to update request")
        setSaving(false)
        return
      }

      setRequests((prev) =>
        prev.map((r) =>
          r.id === editingId
            ? {
                ...data,
                budget: data.budget ? data.budget.toString() : null,
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              }
            : r
        )
      )
      resetForm()
    },
    [editingId, form, resetForm, serializeForm]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      const request = requests.find((r) => r.id === id)
      if (!request) return

      startTransition(() => {
        addOptimistic({ type: "delete", request })
      })

      const res = await fetch(`/api/requests/${id}`, { method: "DELETE" })

      if (!res.ok) {
        setRequests((prev) => [...prev, request])
        return
      }

      setRequests((prev) => prev.filter((r) => r.id !== id))
    },
    [requests, addOptimistic]
  )

  const startEdit = useCallback(
    (request: RequestItem) => {
      setEditingId(request.id)
      setForm({
        title: request.title,
        description: request.description || "",
        budget: request.budget || "",
        status: request.status,
      })
      setShowForm(true)
      setError("")
    },
    []
  )

  return (
    <div className="space-y-6">
      {!showForm && (
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="bg-accent-sage text-white px-6 py-3 rounded-lg font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase hover:opacity-90 transition-all"
        >
          New request
        </button>
      )}

      {showForm && (
        <form
          onSubmit={editingId ? handleUpdate : handleCreate}
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
            <input
              id="title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-cream font-body text-[16px] leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-sage focus:border-accent-sage transition-all"
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
            <textarea
              id="description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-cream font-body text-[16px] leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-sage focus:border-accent-sage transition-all resize-y"
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
            <input
              id="budget"
              type="number"
              step="0.01"
              value={form.budget}
              onChange={(e) =>
                setForm((p) => ({ ...p, budget: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface-cream font-body text-[16px] leading-relaxed text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-accent-sage focus:border-accent-sage transition-all"
              placeholder="5000"
            />
          </div>

          {editingId && (
            <div className="space-y-2">
              <label className="font-label text-[12px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface">
                Status
              </label>

              {form.status === "DONE" ? (
                <div className="px-4 py-3 rounded-lg border border-border/20 bg-surface-container-low">
                  <p className="font-body text-[14px] leading-relaxed text-on-surface-variant">
                    This request is <strong className="text-text-rich">Done</strong> and cannot be
                    reopened. If you need additional work, create a new request.
                  </p>
                </div>
              ) : (
                <div className="flex gap-2">
                  {[form.status, ...nextStatus[form.status]].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, status: s }))}
                      disabled={s === form.status}
                      className={`flex-1 px-4 py-3 rounded-lg border font-label text-[13px] leading-[1.2] tracking-[0.02em] font-semibold transition-all ${
                        form.status === s
                          ? "bg-surface-container-high text-on-surface-variant border-border cursor-default"
                          : "bg-surface-container-lowest text-on-surface border-border hover:bg-surface-container-low"
                      }`}
                    >
                      {statusLabels[s]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-accent-sage text-white px-6 py-3 rounded-lg font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create request"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-border text-on-surface px-6 py-3 rounded-lg font-label text-[14px] leading-[1.2] tracking-[0.05em] font-semibold uppercase hover:bg-surface-container-low transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {optimisticRequests.length === 0 && !showForm && (
        <div className="text-center py-20">
          <p className="font-display text-[22px] leading-[1.2] text-on-surface-variant">
            No requests yet
          </p>
          <p className="font-body text-[16px] leading-relaxed text-on-surface-variant mt-2">
            Create your first request to get started.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {optimisticRequests.map((request) => (
          <div
            key={request.id}
            className="bg-surface-container-lowest rounded-xl border border-border/20 p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-display text-[20px] leading-[1.3] text-text-rich truncate">
                    {request.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] leading-[1.2] font-semibold font-label border ${statusStyles[request.status]}`}
                  >
                    {statusLabels[request.status]}
                  </span>
                </div>
                {request.description && (
                  <p className="font-body text-[15px] leading-relaxed text-on-surface-variant mt-2 line-clamp-2">
                    {request.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3">
                  {request.budget && (
                    <span className="font-body text-[14px] leading-relaxed text-on-surface-variant font-semibold">
                      ${parseFloat(request.budget).toLocaleString("en-US")}
                    </span>
                  )}
                  <span className="font-body text-[13px] leading-relaxed text-on-surface-variant/60">
                    {new Date(request.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {editingId !== request.id && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(request)}
                    className="font-body text-[14px] leading-relaxed text-accent-sage hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="font-body text-[14px] leading-relaxed text-state-error hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
