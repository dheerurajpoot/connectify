"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
	getSystemStats as getSystemStatsDB,
	getRecentUsers as getRecentUsersDB,
	getRecentPosts as getRecentPostsDB,
	toggleUserVerification as toggleUserVerificationDB,
	updateUserRole as updateUserRoleDB,
	deleteUserAndContent as deleteUserAndContentDB,
	getUserById as getUserByIdDB,
	getAllUsers as getAllUsersDB,
	updateUser as updateUserDB,
	getAllStories as getAllStoriesDB,
	createAdminNotification as createAdminNotificationDB,
	updateStoryStatus as updateStoryStatusDB,
	getAllAdminNotifications as getAllAdminNotificationsFromDB,
} from "@/lib/db";
import { Post } from "@/models";
import { Types } from "mongoose";
import Notification from "@/models/Notification";

interface IPopulatedUser {
	_id: Types.ObjectId;
	name: string;
	username: string;
	avatar: string;
	isVerified: boolean;
}

interface IPopulatedPost {
	_id: Types.ObjectId;
	content: string;
	userId: IPopulatedUser;
	createdAt: Date;
	likes: Types.ObjectId[];
	comments: Types.ObjectId[];
	status?: "active" | "hidden" | "flagged";
}

// Post management functions
export async function getAllPosts() {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		type PopulatedPostDocument = {
			_id: Types.ObjectId;
			content: string;
			userId: IPopulatedUser;
			createdAt: Date;
			likes: Types.ObjectId[];
			comments: Types.ObjectId[];
			status?: "active" | "hidden" | "flagged";
		};

		const posts = (await Post.find()
			.sort({ createdAt: -1 })
			.populate<{ userId: IPopulatedUser }>(
				"userId",
				"name username avatar isVerified"
			)
			.lean()) as unknown as PopulatedPostDocument[];

		return {
			success: true,
			posts: posts.map((post) => ({
				_id: post._id.toString(),
				content: post.content,
				user: {
					id: post.userId._id.toString(),
					name: post.userId.name,
					username: post.userId.username,
					avatar: post.userId.avatar,
					isVerified: post.userId.isVerified,
				},
				createdAt: post.createdAt.toISOString(),
				likes: post.likes.length,
				comments: post.comments.length,
				status: post.status || "active",
				trending: post.likes.length > 100 || post.comments.length > 20,
			})),
		};
	} catch (error) {
		console.error("Error fetching posts:", error);
		return { error: "Failed to fetch posts" };
	}
}

export async function updatePostStatus(
	postId: string,
	status: "active" | "hidden" | "flagged"
) {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const post = (await Post.findByIdAndUpdate(
			postId,
			{ status },
			{ new: true }
		)
			.populate("userId", "name username avatar isVerified")
			.lean()) as unknown as IPopulatedPost;

		if (!post) {
			return { error: "Post not found" };
		}

		return {
			success: true,
			message: `Post status updated to ${status} successfully`,
			post: {
				id: post._id.toString(),
				content: post.content,
				user: {
					id: post.userId._id.toString(),
					name: post.userId.name,
					username: post.userId.username,
					avatar: post.userId.avatar,
					isVerified: post.userId.isVerified,
				},
				createdAt: post.createdAt.toISOString(),
				likes: post.likes.length,
				comments: post.comments.length,
				status: post.status || "active",
				trending: post.likes.length > 100 || post.comments.length > 20,
			},
		};
	} catch (error) {
		console.error("Error updating post status:", error);
		return { error: "Failed to update post status" };
	}
}

// Helper to check if user is admin
async function isAdmin() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		throw new Error("Not authenticated");
	}

	const user = await getUserByIdDB(session.user.id);
	return user?.role === "admin";
}

export async function getAdminDashboardStats() {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const stats = await getSystemStatsDB();
		return { success: true, stats };
	} catch (error) {
		console.error("Error fetching admin stats:", error);
		return { error: "Failed to fetch system statistics" };
	}
}

export async function getAdminUsers() {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const users = await getAllUsersDB();
		return {
			success: true,
			users: users.map((user) => ({
				_id: user._id,
				name: user.name,
				username: user.username,
				email: user.email,
				avatar: user.avatar,
				isVerified: Boolean(user.isVerified),
				createdAt: user.createdAt,
				role: user.role || "user",
				status: (user.isVerified ? "active" : "pending") as
					| "active"
					| "pending"
					| "suspended",
			})),
		};
	} catch (error) {
		console.error("Error fetching users:", error);
		return { error: "Failed to fetch users" };
	}
}

export async function getAdminRecentUsers() {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const users = await getRecentUsersDB();
		return { success: true, users };
	} catch (error) {
		console.error("Error fetching recent users:", error);
		return { error: "Failed to fetch recent users" };
	}
}

export async function getAdminRecentPosts() {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const posts = await getRecentPostsDB();
		return { success: true, posts };
	} catch (error) {
		console.error("Error fetching recent posts:", error);
		return { error: "Failed to fetch recent posts" };
	}
}

interface IStory {
	_id: string;
	userId: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	media: string;
	createdAt: string;
	expiresAt: string;
	viewers: string[];
	status: "active" | "expired" | "flagged";
	trending?: boolean;
}

interface IDBStory {
	_id: string;
	userId: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	media: string;
	createdAt: string;
	expiresAt: string;
	viewers: Types.ObjectId[];
	status?: "active" | "expired" | "flagged";
	trending: boolean;
	$assertPopulated?: <Paths = {}>(
		path: string | string[],
		values?: Partial<Paths> | undefined
	) => any;
	__v?: number;
}

interface APIResponse<T> {
	error?: string;
	success?: boolean;
	message?: string;
	stories?: T[];
	story?: T;
}

export async function getAllStories(): Promise<APIResponse<IStory>> {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const dbStories = (await getAllStoriesDB()) as unknown as IDBStory[];
		const stories = dbStories.map((story) => ({
			_id: story._id,
			userId: story.userId,
			media: story.media,
			createdAt: story.createdAt,
			expiresAt: story.expiresAt,
			viewers: story.viewers.map((v) => v.toString()),
			status: story.status || ("active" as const),
			trending: story.trending,
		}));
		return { success: true, stories };
	} catch (error) {
		console.error("Error fetching stories:", error);
		return { error: "Failed to fetch stories" };
	}
}

export async function updateStoryStatus(
	storyId: string,
	status: "active" | "expired" | "flagged"
): Promise<APIResponse<IStory>> {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const dbStory = await updateStoryStatusDB(storyId, status);
		// Transform the database story into the expected IStory format
		const story: IStory = {
			_id: dbStory._id.toString(),
			userId: {
				_id: (dbStory.userId as any)._id.toString(),
				name: (dbStory.userId as any).name,
				username: (dbStory.userId as any).username,
				avatar: (dbStory.userId as any).avatar,
				isVerified: (dbStory.userId as any).isVerified,
			},
			media: dbStory.media,
			createdAt: dbStory.createdAt,
			expiresAt: dbStory.expiresAt,
			viewers: Array.isArray(dbStory.viewers)
				? dbStory.viewers.map((id) => id.toString())
				: [],
			status: status as "active" | "expired" | "flagged",
			trending: Boolean(dbStory.trending),
		};
		return {
			success: true,
			message: `Story status updated to ${status} successfully`,
			story,
		};
	} catch (error) {
		console.error("Error updating story status:", error);
		return { error: "Failed to update story status" };
	}
}

export async function handleUserVerification(userId: string) {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const user = await toggleUserVerificationDB(userId);
		return {
			success: true,
			message: `User ${
				user.isVerified ? "verified" : "unverified"
			} successfully`,
			user,
		};
	} catch (error) {
		console.error("Error toggling user verification:", error);
		return { error: "Failed to update user verification status" };
	}
}

export async function handleUserRole(userId: string, role: "user" | "admin") {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const user = await updateUserRoleDB(userId, role);
		return {
			success: true,
			message: `User role updated to ${role} successfully`,
			user,
		};
	} catch (error) {
		console.error("Error updating user role:", error);
		return { error: "Failed to update user role" };
	}
}

export async function updateUser(
	userId: string,
	data: {
		name: string;
		username: string;
		email: string;
		bio?: string;
		location?: string;
		website?: string;
		isVerified?: boolean;
	}
) {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const user = await updateUserDB(userId, data);
		return {
			success: true,
			message: "User profile updated successfully",
			user,
		};
	} catch (error) {
		console.error("Error updating user profile:", error);
		return { error: "Failed to update user profile" };
	}
}

export async function handleUserDeletion(userId: string) {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		await deleteUserAndContentDB(userId);
		return {
			success: true,
			message: "User and associated content deleted successfully",
		};
	} catch (error) {
		console.error("Error deleting user:", error);
		return { error: "Failed to delete user and their content" };
	}
}

// Admin notification actions
export async function createAdminNotification(message: string) {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return { error: "Unauthorized access" };
		}

		await createAdminNotificationDB(message, session.user.id);
		return { success: true, message: "Notification sent successfully" };
	} catch (error) {
		console.error("Error creating admin notification:", error);
		return { error: "Failed to send notification" };
	}
}

export interface IAdminNotification {
	_id: string;
	userId: string;
	actorId: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	message: string;
	createdAt: string;
	read: boolean;
	type: string;
}

async function getAllAdminNotificationsDB(): Promise<IAdminNotification[]> {
	const notifications = await Notification.find({ type: "admin" })
		.populate("actorId", "name username avatar isVerified")
		.sort({ createdAt: -1 })
		.lean();

	return notifications as unknown as IAdminNotification[];
}

export async function getAdminNotifications(): Promise<{
	error?: string;
	success?: boolean;
	notifications?: IAdminNotification[];
}> {
	if (!(await isAdmin())) {
		return { error: "Unauthorized access" };
	}

	try {
		const notifications = await getAllAdminNotificationsFromDB();
		return { success: true, notifications };
	} catch (error) {
		console.error("Error fetching admin notifications:", error);
		return { error: "Failed to fetch notifications" };
	}
}
