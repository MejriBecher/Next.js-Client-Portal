import { Skeleton } from "@/components/ui/skeleton"

export function InsightsSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-border/20 p-6 space-y-3"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-border/20 p-6 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="bg-white rounded-xl border border-border/20 p-6 space-y-4">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    </div>
  )
}
