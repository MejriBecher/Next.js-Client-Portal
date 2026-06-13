import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { InsightsContent } from "./insights-content"
import { InsightsSkeleton } from "./insights-skeleton"

export default async function InsightsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-[32px] leading-[1.2] text-text-rich">
          Insights
        </h1>
        <p className="font-body text-[16px] leading-relaxed text-on-surface-variant mt-1">
          Your request analytics
        </p>
      </div>

      <Suspense fallback={<InsightsSkeleton />}>
        <InsightsContent userId={session.user.id} />
      </Suspense>
    </div>
  )
}
