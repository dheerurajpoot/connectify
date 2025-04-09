import type { Metadata } from "next"
import { CreatePostForm } from "@/components/create-post-form"

export const metadata: Metadata = {
  title: "Create Post",
  description: "Share what's on your mind",
}

export default function CreatePage() {
  return (
    <div className="container max-w-2xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Create Post</h1>
      <CreatePostForm />
    </div>
  )
}
