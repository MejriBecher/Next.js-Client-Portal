import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { DashboardRequests } from "@/components/dashboard-requests"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard")
  }

  const requests = await db.request.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  })

  const serialized = requests.map((r) => ({
    ...r,
    budget: r.budget ? r.budget.toString() : null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-[32px] leading-[1.2] text-text-rich">
            Your requests
          </h1>
          <p className="font-body text-[16px] leading-relaxed text-on-surface-variant mt-1">
            {serialized.length}{" "}
            {serialized.length === 1 ? "request" : "requests"} total
          </p>
        </div>
      </div>

      <DashboardRequests initialRequests={serialized} />
    </div>
  )
}
