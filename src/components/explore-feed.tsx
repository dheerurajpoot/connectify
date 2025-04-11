import Image from "next/image";
import Link from "next/link";
import { getFeed } from "@/app/actions/post-actions";

interface Post {
  _id: string;
  media: string[];
  userId: {
    _id: string;
    name: string;
    username: string;
    avatar?: string;
  };
}

async function getExplorePosts() {
  const result = await getFeed();
  if (!result.success || !result.posts) {
    return [];
  }
  return result.posts;
}

export async function ExploreFeed() {
  const posts = await getExplorePosts();

  if (!posts.length) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No posts found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.map((post: Post) => (
        <Link
          key={post._id}
          href={`/post/${post._id}`}
          className="group aspect-square relative overflow-hidden"
        >
          <Image
            src={post.media[0] || "/placeholder.svg"}
            alt={`Post by ${post.userId.username}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  );
}
