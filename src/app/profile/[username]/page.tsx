import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ProfilePosts } from "@/components/profile-posts"
import { ProfileAbout } from "@/components/profile-about"
import { ProfileFollowers } from "@/components/profile-followers"
import { Suspense } from "react"
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton"
import type { Metadata } from "next"

type Props = {
  params: { username: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = params.username

  // In a real app, fetch user data here
  const userData = {
    name: "Alex Johnson",
    bio: "Digital creator and photography enthusiast",
    username: username,
  }

  return {
    title: `${userData.name} (@${userData.username})`,
    description: userData.bio,
    openGraph: {
      title: `${userData.name} (@${userData.username})`,
      description: userData.bio,
    },
  }
}

export default function ProfilePage({ params }: Props) {
  const username = params.username

  return (
    <div className="container px-4 py-6">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="h-24 w-24 border-2 border-background">
            <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={username} />
            <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold">Alex Johnson</h1>
            <p className="text-muted-foreground">@{username}</p>
          </div>
          <div className="ml-auto">
            <Button>Follow</Button>
          </div>
        </div>

        <div className="flex justify-around text-center">
          <div>
            <p className="font-bold">254</p>
            <p className="text-sm text-muted-foreground">Posts</p>
          </div>
          <div>
            <p className="font-bold">14.2K</p>
            <p className="text-sm text-muted-foreground">Followers</p>
          </div>
          <div>
            <p className="font-bold">1,024</p>
            <p className="text-sm text-muted-foreground">Following</p>
          </div>
        </div>

        <p>Digital creator and photography enthusiast. Sharing moments from around the world. ✈️ 🌍 📸</p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="posts">
            Posts
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="about">
            About
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="followers">
            Followers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <Suspense fallback={<ProfileSkeleton />}>
            <ProfilePosts username={username} />
          </Suspense>
        </TabsContent>
        <TabsContent value="about">
          <ProfileAbout username={username} />
        </TabsContent>
        <TabsContent value="followers">
          <ProfileFollowers username={username} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
