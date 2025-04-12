"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
	getNotifications,
	readNotification,
	readAllNotifications,
} from "@/app/actions/notification-actions";
import { useSession } from "next-auth/react";
import { useToast } from "../hooks/use-toast";
interface Notification {
	_id: string;
	userId: string;
	type: "like" | "comment" | "follow" | "mention";
	actorId: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
	};
	postId?: string;
	commentId?: string;
	read: boolean;
	createdAt: string;
}

interface NotificationListProps {
	type: "all" | "mentions" | "likes" | "comments";
}

export function NotificationList({ type }: NotificationListProps) {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [page, setPage] = useState(1);
	const [hasMore, setHasMore] = useState(true);
	const [loading, setLoading] = useState(true);
	const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
	const { toast } = useToast();
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.user?.id) {
			fetchNotifications();
		}
	}, [session, type]);

	const fetchNotifications = async (pageNum = page) => {
		if (pageNum === 1) {
			setLoading(true);
		}

		try {
			const result = await getNotifications(pageNum);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			} else if (result?.success) {
				// Transform the data to match our interface
				const transformedNotifications = result.notifications.map(
					(n: any) => {
						const notification: Notification = {
							_id: n._id.toString(),
							userId: n.userId.toString(),
							type: n.type,
							actorId: {
								_id: n.actorId._id.toString(),
								name: n.actorId.name,
								username: n.actorId.username,
								avatar: n.actorId.avatar,
							},
							postId: n.postId ? n.postId.toString() : undefined,
							commentId: n.commentId
								? n.commentId.toString()
								: undefined,
							read: n.read,
							createdAt: n.createdAt,
						};

						return notification;
					}
				);

				if (pageNum === 1) {
					setNotifications(transformedNotifications);
				} else {
					setNotifications((prev) => [
						...prev,
						...transformedNotifications,
					]);
				}

				// If we got less than 20 items, there are no more pages
				setHasMore(transformedNotifications.length === 20);
			}
		} catch (error) {
			console.error("Fetch notifications error:", error);
			toast({
				title: "Error",
				description: "Failed to load notifications",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleMarkAsRead = async (notificationId: string) => {
		try {
			await readNotification(notificationId);

			// Update the local state
			setNotifications((prev) =>
				prev.map((notification) =>
					notification._id === notificationId
						? { ...notification, read: true }
						: notification
				)
			);
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to mark notification as read",
				variant: "destructive",
			});
		}
	};

	const handleMarkAllAsRead = async () => {
		setMarkingAllAsRead(true);
		try {
			await readAllNotifications();

			// Update the local state
			setNotifications((prev) =>
				prev.map((notification) => ({ ...notification, read: true }))
			);

			toast({
				title: "Success",
				description: "All notifications marked as read",
			});
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to mark all notifications as read",
				variant: "destructive",
			});
		} finally {
			setMarkingAllAsRead(false);
		}
	};

	// Filter notifications based on type
	const filteredNotifications =
		type === "all"
			? notifications
			: notifications.filter((notification) => {
					if (type === "mentions")
						return notification.type === "mention";
					if (type === "likes") return notification.type === "like";
					if (type === "comments")
						return notification.type === "comment";
					return true;
			  });

	const getRelativeTime = (date: Date) => {
		const now = new Date();
		const diffInSeconds = Math.floor(
			(now.getTime() - date.getTime()) / 1000
		);

		if (diffInSeconds < 60) return "just now";
		if (diffInSeconds < 3600)
			return `${Math.floor(diffInSeconds / 60)}m ago`;
		if (diffInSeconds < 86400)
			return `${Math.floor(diffInSeconds / 3600)}h ago`;
		if (diffInSeconds < 604800)
			return `${Math.floor(diffInSeconds / 86400)}d ago`;
		return date.toLocaleDateString();
	};

	const getNotificationContent = (notification: Notification) => {
		switch (notification.type) {
			case "like":
				return "liked your post";
			case "comment":
				return "commented on your post";
			case "follow":
				return "started following you";
			case "mention":
				return "mentioned you in a comment";
			default:
				return "";
		}
	};

	return (
		<div className='space-y-4'>
			{loading ? (
				<div className='flex items-center justify-center p-8'>
					<p>Loading notifications...</p>
				</div>
			) : filteredNotifications.length === 0 ? (
				<div className='flex items-center justify-center p-8'>
					<p className='text-center text-sm text-muted-foreground'>
						No notifications found
					</p>
				</div>
			) : (
				<>
					{filteredNotifications.map((notification) => (
						<div
							key={notification._id}
							className='flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent'
							onClick={() => handleMarkAsRead(notification._id)}>
							{!notification.read && (
								<div className='mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-primary' />
							)}
							<Link
								href={`/profile/${notification.actorId.username}`}>
								<Avatar>
									<AvatarImage
										src={notification.actorId.avatar || ""}
										alt={notification.actorId.name}
									/>
									<AvatarFallback>
										{notification.actorId.name.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
							</Link>
							<div className='flex-1'>
								<div className='flex items-center gap-1'>
									<Link
										href={`/profile/${notification.actorId.username}`}
										className='font-medium hover:underline'>
										{notification.actorId.name}
									</Link>
									<span className='text-sm'>
										{getNotificationContent(notification)}
									</span>
									<span className='text-xs text-muted-foreground'>
										{getRelativeTime(
											new Date(notification.createdAt)
										)}
									</span>
								</div>
								{notification.postId && (
									<Link
										href={`/post/${notification.postId}`}
										className='mt-1 text-sm text-muted-foreground hover:underline'>
										View post
									</Link>
								)}
							</div>
							{notification.type === "follow" && (
								<Link
									href={`/profile/${notification.actorId.username}`}>
									<Button
										variant='outline'
										size='sm'
										className='flex-shrink-0 cursor-pointer'>
										Follow Back
									</Button>
								</Link>
							)}
						</div>
					))}

					{filteredNotifications.some(
						(notification) => !notification.read
					) && (
						<Button
							variant='outline'
							className='w-full'
							onClick={handleMarkAllAsRead}
							disabled={markingAllAsRead}>
							{markingAllAsRead
								? "Marking as read..."
								: "Mark all as read"}
						</Button>
					)}

					{!loading && hasMore && (
						<Button
							variant='outline'
							className='w-full'
							onClick={() => {
								setPage((prev) => prev + 1);
								fetchNotifications(page + 1);
							}}>
							Load more
						</Button>
					)}
				</>
			)}
		</div>
	);
}
