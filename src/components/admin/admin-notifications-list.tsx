"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Bell, Users, Calendar } from "lucide-react";

type Notification = {
	id: string;
	title: string;
	content: string;
	type: "announcement" | "update" | "alert";
	sentAt: string;
	scheduledFor?: string;
	status: "sent" | "scheduled" | "draft";
	recipients: {
		total: number;
		opened: number;
	};
};

interface AdminNotificationsListProps {
	filterStatus?: "sent" | "scheduled" | "draft";
}

export function AdminNotificationsList({
	filterStatus,
}: AdminNotificationsListProps) {
	const [notifications, setNotifications] = useState<Notification[]>([
		{
			id: "1",
			title: "Welcome to our new platform!",
			content:
				"We're excited to announce the launch of our new social media platform. Explore all the new features!",
			type: "announcement",
			sentAt: "2023-06-15T10:30:00Z",
			status: "sent",
			recipients: {
				total: 12500,
				opened: 8750,
			},
		},
		{
			id: "2",
			title: "New messaging features available",
			content:
				"We've added new messaging features including group chats and improved media sharing.",
			type: "update",
			sentAt: "2023-06-10T14:45:00Z",
			status: "sent",
			recipients: {
				total: 12500,
				opened: 7200,
			},
		},
		// {
		// 	id: "3",
		// 	title: "Scheduled Maintenance",
		// 	content:
		// 		"We'll be performing scheduled maintenance on June 20th from 2-4 AM UTC. Some features may be unavailable.",
		// 	type: "alert",
		// 	scheduledFor: "2023-06-18T09:00:00Z",
		// 	status: "scheduled",
		// 	recipients: {
		// 		total: 12500,
		// 		opened: 0,
		// 	},
		// },
		// {
		// 	id: "4",
		// 	title: "Upcoming Feature Announcement",
		// 	content: "Stay tuned for an exciting new feature coming next week!",
		// 	type: "announcement",
		// 	scheduledFor: "2023-06-25T12:00:00Z",
		// 	status: "draft",
		// 	recipients: {
		// 		total: 0,
		// 		opened: 0,
		// 	},
		// },
	]);

	// Filter notifications based on props
	const filteredNotifications = notifications.filter((notification) => {
		if (filterStatus && notification.status !== filterStatus) return false;
		return true;
	});

	const deleteNotification = (notificationId: string) => {
		setNotifications(
			notifications.filter(
				(notification) => notification.id !== notificationId
			)
		);
	};

	return (
		<div className='space-y-4'>
			{filteredNotifications.length === 0 ? (
				<div className='rounded-md border p-4 text-center text-sm text-muted-foreground'>
					No notifications found
				</div>
			) : (
				filteredNotifications.map((notification) => (
					<div
						key={notification.id}
						className='rounded-md border p-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div
									className={`rounded-full p-2 ${
										notification.type === "announcement"
											? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
											: notification.type === "update"
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
									}`}>
									<Bell className='h-4 w-4' />
								</div>
								<div>
									<div className='font-medium'>
										{notification.title}
									</div>
									<div className='text-xs text-muted-foreground'>
										{notification.status === "sent"
											? `Sent: ${new Date(
													notification.sentAt
											  ).toLocaleString()}`
											: notification.status ===
											  "scheduled"
											? `Scheduled: ${new Date(
													notification.scheduledFor!
											  ).toLocaleString()}`
											: "Draft"}
									</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
										notification.status === "sent"
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: notification.status ===
											  "scheduled"
											? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
											: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
									}`}>
									{notification.status
										.charAt(0)
										.toUpperCase() +
										notification.status.slice(1)}
								</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' size='icon'>
											<MoreHorizontal className='h-4 w-4' />
											<span className='sr-only'>
												Actions
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>
											Actions
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											View Details
										</DropdownMenuItem>
										{notification.status !== "sent" && (
											<DropdownMenuItem>
												Edit
											</DropdownMenuItem>
										)}
										{notification.status ===
											"scheduled" && (
											<DropdownMenuItem>
												Send Now
											</DropdownMenuItem>
										)}
										{notification.status === "draft" && (
											<DropdownMenuItem>
												Schedule
											</DropdownMenuItem>
										)}
										<DropdownMenuItem
											onClick={() =>
												deleteNotification(
													notification.id
												)
											}>
											Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<div className='mt-2 text-sm'>
							{notification.content}
						</div>
						<div className='mt-3 flex items-center gap-4 text-xs text-muted-foreground'>
							{notification.status !== "draft" && (
								<>
									<div className='flex items-center gap-1'>
										<Users className='h-3.5 w-3.5' />
										<span>
											{notification.recipients.total.toLocaleString()}{" "}
											recipients
											{notification.status === "sent" &&
												` (${Math.round(
													(notification.recipients
														.opened /
														notification.recipients
															.total) *
														100
												)}% opened)`}
										</span>
									</div>
									<div className='flex items-center gap-1'>
										<Calendar className='h-3.5 w-3.5' />
										<span>
											{notification.status === "sent"
												? `Sent ${new Date(
														notification.sentAt
												  ).toLocaleDateString()}`
												: `Scheduled for ${new Date(
														notification.scheduledFor!
												  ).toLocaleDateString()}`}
										</span>
									</div>
								</>
							)}
						</div>
					</div>
				))
			)}
		</div>
	);
}
