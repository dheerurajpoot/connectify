import type { Metadata } from "next"
import { MessageList } from "@/components/message-list"
import { MessageContent } from "@/components/message-content"
import { Suspense } from "react"
import { MessageSkeleton } from "@/components/skeletons/message-skeleton"

export const metadata: Metadata = {
  title: "Messages",
  description: "Your private messages and conversations",
}

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col md:flex-row">
      <div className="w-full border-r md:w-80">
        <Suspense fallback={<MessageSkeleton />}>
          <MessageList />
        </Suspense>
      </div>
      <div className="flex-1">
        <MessageContent />
      </div>
    </div>
  )
}
