import Image from "next/image"
import Link from "next/link"

const exploreItems = [
  {
    id: "1",
    image: "/placeholder.svg?height=400&width=400",
    user: "emma",
  },
  {
    id: "2",
    image: "/placeholder.svg?height=400&width=400",
    user: "alex",
  },
  {
    id: "3",
    image: "/placeholder.svg?height=400&width=400",
    user: "sarah",
  },
  {
    id: "4",
    image: "/placeholder.svg?height=400&width=400",
    user: "michael",
  },
  {
    id: "5",
    image: "/placeholder.svg?height=400&width=400",
    user: "julie",
  },
  {
    id: "6",
    image: "/placeholder.svg?height=400&width=400",
    user: "david",
  },
  {
    id: "7",
    image: "/placeholder.svg?height=400&width=400",
    user: "jessica",
  },
  {
    id: "8",
    image: "/placeholder.svg?height=400&width=400",
    user: "john",
  },
  {
    id: "9",
    image: "/placeholder.svg?height=400&width=400",
    user: "emma",
  },
]

export function ExploreFeed() {
  return (
    <div className="grid grid-cols-2 gap-1 md:grid-cols-3 lg:grid-cols-4">
      {exploreItems.map((item) => (
        <Link key={item.id} href={`/post/${item.id}`} className="group aspect-square relative overflow-hidden">
          <Image
            src={item.image || "/placeholder.svg"}
            alt="Explore item"
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  )
}
