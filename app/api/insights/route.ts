import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id

  const dailyCounts = await db.$queryRaw<
    Array<{ date: string; count: number }>
  >`
    SELECT
      DATE("createdAt") as date,
      COUNT(*)::int as count
    FROM "Request"
    WHERE "userId" = ${userId}
      AND "createdAt" >= NOW() - INTERVAL '30 days'
    GROUP BY DATE("createdAt")
    ORDER BY date
  `

  const statusBreakdown = await db.$queryRaw<
    Array<{ status: string; count: number }>
  >`
    SELECT
      status,
      COUNT(*)::int as count
    FROM "Request"
    WHERE "userId" = ${userId}
    GROUP BY status
    ORDER BY status
  `

  const metrics = await db.$queryRaw<
    Array<{
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
  `

  return NextResponse.json({
    dailyCounts,
    statusBreakdown,
    metrics: metrics[0] ?? {
      total_requests: 0,
      total_budget: 0,
      avg_budget: 0,
      resolution_velocity_hours: null,
    },
  })
}
