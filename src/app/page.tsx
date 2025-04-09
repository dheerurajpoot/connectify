import { Suspense } from "react"
import { FeedSkeleton } from "@/components/skeletons/feed-skeleton"
import { Feed } from "@/components/feed"
import { Stories } from "@/components/stories"
import { SuggestedUsers } from "@/components/suggested-users"
import { TrendingTopics } from "@/components/trending-topics"

export default function HomePage() {
  return (
    <div className="container grid grid-cols-1 gap-4 px-4 py-6 md:grid-cols-4 lg:gap-6">
      <div className="md:col-span-3">
        <h1 className="sr-only">Connectify Home Feed</h1>
        <Stories />
        <Suspense fallback={<FeedSkeleton />}>
          <Feed />
        </Suspense>
      </div>

      <div className="hidden space-y-4 md:block">
        <SuggestedUsers />
        <TrendingTopics />
      </div>
    </div>
  )
}
