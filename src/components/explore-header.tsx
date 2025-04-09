"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useSearchParams, useRouter } from "next/navigation"

const categories = [
  { id: "all", name: "For You" },
  { id: "trending", name: "Trending" },
  { id: "photography", name: "Photography" },
  { id: "travel", name: "Travel" },
  { id: "food", name: "Food" },
  { id: "music", name: "Music" },
  { id: "art", name: "Art" },
  { id: "technology", name: "Technology" },
]

export function ExploreHeader() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get("category") || "all"

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("category", categoryId)
    router.push(`/explore?${params.toString()}`)
  }

  return (
    <div className="mb-6 overflow-x-auto pb-2 scrollbar-hide">
      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.id ? "default" : "outline"}
            size="sm"
            className={cn("rounded-full", currentCategory === category.id ? "" : "text-muted-foreground")}
            onClick={() => handleCategoryChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  )
}
