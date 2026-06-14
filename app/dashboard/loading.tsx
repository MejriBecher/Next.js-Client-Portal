import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-32 mt-2" />
      </div>
      <Skeleton className="h-10 w-28" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest rounded-xl border border-border/20 p-6 space-y-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
