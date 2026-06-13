import { db } from "@/lib/db"
import { RequestTrendChart, StatusBreakdownChart } from "@/components/insights-charts"

type Row<T> = T[]

export async function InsightsContent({ userId }: { userId: string }) {
  let dailyRows: Row<{ date: string; count: number }> = []
  let statusRows: Row<{ status: string; count: number }> = []
  let metricRows: Row<{
    total_requests: number
    total_budget: number
    avg_budget: number
    resolution_velocity_hours: number | null
  }> = []
  let fetchError = false

  try {
    ;[dailyRows, statusRows, metricRows] = await Promise.all([
      db.$queryRaw<Row<{ date: string; count: number }>>`
        SELECT
          DATE("createdAt") as date,
          COUNT(*)::int as count
        FROM "Request"
        WHERE "userId" = ${userId}
          AND "createdAt" >= NOW() - INTERVAL '30 days'
        GROUP BY DATE("createdAt")
        ORDER BY date
      `,
      db.$queryRaw<Row<{ status: string; count: number }>>`
        SELECT
          status,
          COUNT(*)::int as count
        FROM "Request"
        WHERE "userId" = ${userId}
        GROUP BY status
        ORDER BY status
      `,
      db.$queryRaw<
        Row<{
          total_requests: number
          total_budget: number
          avg_budget: number
          resolution_velocity_hours: number | null
        }>
      >`
        SELECT
          COUNT(*)::int as total_requests,
          COALESCE(SUM(budget), 0)::numeric as total_budget,
          COALESCE(AVG(NULLIF(budget, 0)), 0)::numeric as avg_budget,
          CASE
            WHEN COUNT(*) FILTER (WHERE status = 'DONE') > 0
            THEN ROUND(
              PERCENTILE_CONT(0.5) WITHIN GROUP (
                ORDER BY EXTRACT(EPOCH FROM "updatedAt" - "createdAt") / 3600.0
              )::numeric, 1
            )
            ELSE NULL
          END as resolution_velocity_hours
        FROM "Request"
        WHERE "userId" = ${userId}
      `,
    ])
  } catch {
    fetchError = true
  }

  const metrics = metricRows[0] ?? {
    total_requests: 0,
    total_budget: 0,
    avg_budget: 0,
    resolution_velocity_hours: null,
  }

  if (fetchError) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-[22px] leading-[1.2] text-state-error">
          Failed to load insights
        </p>
        <p className="font-body text-[16px] leading-relaxed text-on-surface-variant mt-2">
          Try refreshing the page. If the problem persists, check your connection.
        </p>
      </div>
    )
  }

  if (metrics.total_requests === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-display text-[22px] leading-[1.2] text-on-surface-variant">
          No data yet
        </p>
        <p className="font-body text-[16px] leading-relaxed text-on-surface-variant mt-2">
          Create a request to see insights and analytics here.
        </p>
      </div>
    )
  }

  const statusLabels: Record<string, string> = {
    PENDING: "Pending",
    IN_PROGRESS: "In progress",
    DONE: "Done",
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="Total requests"
          value={metrics.total_requests.toString()}
          sub="All time"
        />
        <MetricCard
          label="Total budget"
          value={`$${Number(metrics.total_budget).toLocaleString()}`}
          sub="Across all requests"
        />
        <MetricCard
          label="Average budget"
          value={`$${Number(metrics.avg_budget).toLocaleString()}`}
          sub="Per request"
        />
        <MetricCard
          label="Resolution velocity"
          value={
            metrics.resolution_velocity_hours !== null
              ? `${metrics.resolution_velocity_hours} hrs`
              : "—"
          }
          sub={
            metrics.resolution_velocity_hours !== null
              ? "Median time to done"
              : "No completed requests"
          }
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl border border-border/20 p-6">
          <h2 className="font-display text-[18px] leading-[1.3] text-text-rich mb-4">
            Requests over last 30 days
          </h2>
          <RequestTrendChart data={dailyRows} />
        </div>
        <div className="bg-surface-container-lowest rounded-xl border border-border/20 p-6">
          <h2 className="font-display text-[18px] leading-[1.3] text-text-rich mb-4">
            Breakdown by status
          </h2>
          <StatusBreakdownChart
            data={statusRows.map((r) => ({
              name: statusLabels[r.status] ?? r.status,
              value: r.count,
            }))}
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub: string
}) {
  return (
    <div className="bg-surface-container-lowest rounded-xl border border-border/20 p-6">
      <p className="font-label text-[11px] leading-[1.2] tracking-[0.05em] font-semibold uppercase text-on-surface-variant mb-1">
        {label}
      </p>
      <p className="font-display text-[28px] leading-[1.2] text-text-rich">
        {value}
      </p>
      <p className="font-body text-[13px] leading-relaxed text-on-surface-variant/60 mt-1">
        {sub}
      </p>
    </div>
  )
}
