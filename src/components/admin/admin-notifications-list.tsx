"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	MoreHorizontal,
	Bell,
	Users,
	Calendar,
	BadgeCheck,
} from "lucide-react";
import { getAdminNotifications } from "@/app/actions/admin-actions";
import { toast } from "sonner";

interface INotification {
	_id: string;
	message: string;
	createdAt: string;
	actorId: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	read: boolean;
}

interface AdminNotificationsListProps {
	filterStatus?: "sent" | "scheduled" | "draft";
}

export function AdminNotificationsList({
	filterStatus,
}: AdminNotificationsListProps) {
	const [notifications, setNotifications] = useState<INotification[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchNotifications() {
			try {
				const response = await getAdminNotifications();
				if (response.error) {
					throw new Error(response.error);
				}
				setNotifications(response.notifications || []);
			} catch (error) {
				toast.error(
					error instanceof Error
						? error.message
						: "Failed to load notifications"
				);
			} finally {
				setLoading(false);
			}
		}

		fetchNotifications();
	}, []);

	if (loading) {
		return <div className='text-center py-4'>Loading notifications...</div>;
	}

	if (!notifications.length) {
		return (
			<div className='text-center py-4 text-muted-foreground'>
				No notifications found
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			{notifications.map((notification) => (
				<div
					key={notification._id}
					className='flex items-start gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm'>
					<div className='flex-1'>
						<div className='flex items-center gap-2'>
							<Bell className='h-4 w-4 text-muted-foreground' />
							<span className='text-sm font-medium flex items-center gap-1'>
								{notification.actorId.name}
								{notification.actorId.isVerified && (
									<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
								)}
							</span>
							<span className='text-xs text-muted-foreground'>
								{new Date(
									notification.createdAt
								).toLocaleDateString()}
							</span>
						</div>
						<p className='mt-1 text-sm'>{notification.message}</p>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' className='h-8 w-8 p-0'>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Mark as read</DropdownMenuItem>
							<DropdownMenuItem className='text-destructive'>
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			))}
		</div>
	);
}
