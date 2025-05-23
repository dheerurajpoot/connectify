"use server";

import {
	getUserNotifications,
	markNotificationAsRead,
	markAllNotificationsAsRead,
} from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications(page = 1) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to view notifications" };
		}

		const notifications = await getUserNotifications(session.user.id, page);

		// Transform MongoDB documents to plain objects
		const plainNotifications = notifications.map((notification: any) => ({
			_id: notification._id.toString(),
			userId: notification.userId.toString(),
			type: notification.type,
			actorId: {
				_id: notification.actorId._id.toString(),
				name: notification.actorId.name,
				username: notification.actorId.username,
				avatar: notification.actorId.avatar,
				isVerified: notification.actorId.isVerified,
			},
			postId: notification.postId?._id.toString(),
			commentId: notification.commentId?._id.toString(),
			read: notification.read,
			message: notification.message,
			createdAt:
				notification.createdAt instanceof Date
					? notification.createdAt.toISOString()
					: notification.createdAt,
		}));

		return { success: true, notifications: plainNotifications };
	} catch (error) {
		console.error("Get notifications error:", error);
		return { error: "Failed to get notifications" };
	}
}

export async function readNotification(notificationId: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to read notifications" };
		}

		await markNotificationAsRead(notificationId);

		revalidatePath("/notifications");
		return { success: true };
	} catch (error) {
		console.error("Read notification error:", error);
		return { error: "Failed to read notification" };
	}
}

export async function readAllNotifications() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to read notifications" };
		}

		await markAllNotificationsAsRead(session.user.id);

		revalidatePath("/notifications");
		return { success: true };
	} catch (error) {
		console.error("Read all notifications error:", error);
		return { error: "Failed to read all notifications" };
	}
}
