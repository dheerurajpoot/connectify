import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
    </div>
  )
}
