import Image from "next/image"
import Link from "next/link"

interface ProfilePostsProps {
  username: string
}

const posts = [
  {
    id: "1",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "2",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "3",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "4",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "5",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "6",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "7",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "8",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: "9",
    image: "/placeholder.svg?height=400&width=400",
  },
]

export function ProfilePosts({ username }: ProfilePostsProps) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post) => (
        <Link key={post.id} href={`/post/${post.id}`} className="group aspect-square relative overflow-hidden">
          <Image
            src={post.image || "/placeholder.svg"}
            alt="Post thumbnail"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  )
}
