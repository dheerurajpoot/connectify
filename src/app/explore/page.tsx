import { Suspense } from "react"
import { ExploreHeader } from "@/components/explore-header"
import { ExploreFeed } from "@/components/explore-feed"
import { ExploreSkeleton } from "@/components/skeletons/explore-skeleton"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Explore",
  description: "Discover trending posts, photos, and videos from around the world",
}

export default function ExplorePage() {
  return (
    <div className="container px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Explore</h1>
      <ExploreHeader />
      <Suspense fallback={<ExploreSkeleton />}>
        <ExploreFeed />
      </Suspense>
    </div>
  )
}
