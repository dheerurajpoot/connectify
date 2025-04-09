import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const suggestedUsers = [
  {
    name: "Sophie Taylor",
    username: "sophie",
    avatar: "/placeholder.svg?height=32&width=32",
    reason: "Followed by emma and 2 others",
  },
  {
    name: "Daniel Roberts",
    username: "daniel",
    avatar: "/placeholder.svg?height=32&width=32",
    reason: "New to Connectify",
  },
  {
    name: "Rachel Green",
    username: "rachel",
    avatar: "/placeholder.svg?height=32&width=32",
    reason: "Suggested for you",
  },
]

export function SuggestedUsers() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Suggested for you</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {suggestedUsers.map((user) => (
          <div key={user.username} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/profile/${user.username}`} className="text-sm font-medium hover:underline">
                  {user.name}
                </Link>
                <p className="text-xs text-muted-foreground">{user.reason}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Follow
            </Button>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground">
          See more
        </Button>
      </CardContent>
    </Card>
  )
}
