import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotificationList } from "@/components/notification-list"
import { Suspense } from "react"
import { NotificationSkeleton } from "@/components/skeletons/notification-skeleton"

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your activity and notifications",
}

export default function NotificationsPage() {
  return (
    <div className="container px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold">Notifications</h1>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="likes">Likes</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Suspense fallback={<NotificationSkeleton />}>
            <NotificationList type="all" />
          </Suspense>
        </TabsContent>
        <TabsContent value="mentions">
          <Suspense fallback={<NotificationSkeleton />}>
            <NotificationList type="mentions" />
          </Suspense>
        </TabsContent>
        <TabsContent value="likes">
          <Suspense fallback={<NotificationSkeleton />}>
            <NotificationList type="likes" />
          </Suspense>
        </TabsContent>
        <TabsContent value="comments">
          <Suspense fallback={<NotificationSkeleton />}>
            <NotificationList type="comments" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
