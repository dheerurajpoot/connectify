import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const trendingTopics = [
  {
    name: "#Photography",
    posts: "2.4K posts",
  },
  {
    name: "#TravelTuesday",
    posts: "1.8K posts",
  },
  {
    name: "#TechNews",
    posts: "5.2K posts",
  },
  {
    name: "#HealthyLiving",
    posts: "3.1K posts",
  },
  {
    name: "#MusicFestival",
    posts: "4.7K posts",
  },
]

export function TrendingTopics() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Trending topics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {trendingTopics.map((topic) => (
          <Link
            key={topic.name}
            href={`/explore?tag=${topic.name.replace("#", "")}`}
            className="flex items-center justify-between rounded-md p-2 text-sm hover:bg-muted"
          >
            <span className="font-medium">{topic.name}</span>
            <span className="text-xs text-muted-foreground">{topic.posts}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
