"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getNotifications, readNotification, readAllNotifications } from "@/app/actions/notification-actions"
import { useSession } from "next-auth/react"
import { useToast } from "../../hooks/use-toast"
interface Notification {
  _id: string
  userId: string
  type: "like" | "comment" | "follow" | "mention"
  actorId: string
  postId?: string
  commentId?: string
  read: boolean
  createdAt: string
  actor?: {
    name: string
    username: string
    avatar: string
  }
}

interface NotificationListProps {
  type: "all" | "mentions" | "likes" | "comments"
}

export function NotificationList({ type }: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      fetchNotifications()
    }
  }, [session, type])

  const fetchNotifications = async () => {
    setLoading(true)

    try {
      const result = await getNotifications()

      if (result?.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else if (result?.success) {
        setNotifications(result.notifications)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await readNotification(notificationId)

      // Update the local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification,
        ),
      )
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      })
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await readAllNotifications()

      // Update the local state
      setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))

      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      })
    }
  }

  // Filter notifications based on type
  const filteredNotifications =
    type === "all"
      ? notifications
      : notifications.filter((notification) => {
          if (type === "mentions") return notification.type === "mention"
          if (type === "likes") return notification.type === "like"
          if (type === "comments") return notification.type === "comment"
          return true
        })

  // Mock data for development
  const mockNotifications = [
    {
      id: "1",
      type: "like",
      user: {
        name: "Emma Wilson",
        username: "emma",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "liked your post",
      post: "Just finished my latest photography project! 📸",
      time: "2m",
      read: false,
    },
    {
      id: "2",
      type: "follow",
      user: {
        name: "Alex Thompson",
        username: "alex",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "started following you",
      time: "1h",
      read: false,
    },
    {
      id: "3",
      type: "comment",
      user: {
        name: "Michael Chen",
        username: "michael",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "commented on your post",
      comment: "This looks amazing! Where was this taken?",
      post: "The view from my morning hike today.",
      time: "3h",
      read: true,
    },
    {
      id: "4",
      type: "mention",
      user: {
        name: "Sophie Taylor",
        username: "sophie",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: "mentioned you in a comment",
      comment: "I think @johndoe would love this place!",
      post: "Check out this new cafe I discovered!",
      time: "1d",
      read: true,
    },
  ]

  // Filter mock notifications based on type
  const filteredMockNotifications =
    type === "all"
      ? mockNotifications
      : mockNotifications.filter((notification) =>
          type === "mentions"
            ? notification.type === "mention"
            : type === "likes"
              ? notification.type === "like"
              : notification.type === "comment",
        )

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <p>Loading notifications...</p>
        </div>
      ) : filteredMockNotifications.length === 0 ? (
        <div className="flex items-center justify-center p-8">
          <p className="text-center text-sm text-muted-foreground">No notifications found</p>
        </div>
      ) : (
        <>
          {filteredMockNotifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
              onClick={() => handleMarkAsRead(notification.id)}
            >
              {!notification.read && <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />}
              <Link href={`/profile/${notification.user.username}`}>
                <Avatar>
                  <AvatarImage src={notification.user.avatar} alt={notification.user.name} />
                  <AvatarFallback>{notification.user.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-1">
                  <Link href={`/profile/${notification.user.username}`} className="font-medium hover:underline">
                    {notification.user.name}
                  </Link>
                  <span className="text-sm">{notification.content}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                {notification.post && (
                  <Link
                    href={`/post/${notification.id}`}
                    className="mt-1 text-sm text-muted-foreground hover:underline"
                  >
                    {notification.post}
                  </Link>
                )}
                {notification.comment && <p className="mt-1 text-sm">"{notification.comment}"</p>}
              </div>
              {notification.type === "follow" && (
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  Follow
                </Button>
              )}
            </div>
          ))}

          {filteredMockNotifications.some((notification) => !notification.read) && (
            <Button variant="outline" className="w-full" onClick={handleMarkAllAsRead}>
              Mark all as read
            </Button>
          )}
        </>
      )}
    </div>
  )
}
