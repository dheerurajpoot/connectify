import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"

interface ProfileFollowersProps {
  username: string
}

const followers = [
  {
    name: "Emma Wilson",
    username: "emma",
    avatar: "/placeholder.svg?height=40&width=40",
    following: true,
  },
  {
    name: "Michael Chen",
    username: "michael",
    avatar: "/placeholder.svg?height=40&width=40",
    following: true,
  },
  {
    name: "Sophie Taylor",
    username: "sophie",
    avatar: "/placeholder.svg?height=40&width=40",
    following: false,
  },
  {
    name: "Daniel Roberts",
    username: "daniel",
    avatar: "/placeholder.svg?height=40&width=40",
    following: true,
  },
  {
    name: "Rachel Green",
    username: "rachel",
    avatar: "/placeholder.svg?height=40&width=40",
    following: false,
  },
]

const following = [
  {
    name: "Emma Wilson",
    username: "emma",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "Michael Chen",
    username: "michael",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    name: "David Lee",
    username: "david",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export function ProfileFollowers({ username }: ProfileFollowersProps) {
  return (
    <Card className="p-1">
      <Tabs defaultValue="followers">
        <TabsList className="w-full">
          <TabsTrigger value="followers" className="flex-1">
            Followers
          </TabsTrigger>
          <TabsTrigger value="following" className="flex-1">
            Following
          </TabsTrigger>
        </TabsList>
        <TabsContent value="followers" className="p-3">
          <div className="grid gap-4">
            {followers.map((user) => (
              <div key={user.username} className="flex items-center justify-between">
                <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </Link>
                <Button variant={user.following ? "outline" : "default"} size="sm">
                  {user.following ? "Following" : "Follow"}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="following" className="p-3">
          <div className="grid gap-4">
            {following.map((user) => (
              <div key={user.username} className="flex items-center justify-between">
                <Link href={`/profile/${user.username}`} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                  </div>
                </Link>
                <Button variant="outline" size="sm">
                  Following
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  )
}
