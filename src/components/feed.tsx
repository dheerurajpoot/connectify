import { Post } from "@/components/post"

const feedPosts = [
  {
    id: "1",
    user: {
      name: "Emma Wilson",
      username: "emma",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timePosted: "2 hours ago",
    content: "Just finished my latest photography project! 📸 So happy with how these turned out. What do you think?",
    media: ["/placeholder.svg?height=600&width=600"],
    likes: 243,
    comments: 56,
    shares: 12,
  },
  {
    id: "2",
    user: {
      name: "Alex Thompson",
      username: "alex",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timePosted: "5 hours ago",
    content: "The view from my morning hike today. The perfect way to start the day! 🌄",
    media: ["/placeholder.svg?height=600&width=800"],
    likes: 542,
    comments: 78,
    shares: 32,
  },
  {
    id: "3",
    user: {
      name: "Michael Chen",
      username: "michael",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    timePosted: "Yesterday",
    content:
      "Finally launched my new website! It's been months in the making, but I'm so proud of how it turned out. Check it out and let me know what you think! 💻✨ #WebDevelopment #Design",
    media: [],
    likes: 187,
    comments: 43,
    shares: 8,
  },
]

export function Feed() {
  return (
    <div className="space-y-4">
      {feedPosts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  )
}
