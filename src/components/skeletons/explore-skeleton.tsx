import { Skeleton } from "@/components/ui/skeleton"

export function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
      {Array(12)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
    </div>
  )
}
