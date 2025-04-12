"use server";

import { getSuggestedUsers, searchUsers, isUserFollowing } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getSuggested() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to get suggested users" };
		}

		const users = await getSuggestedUsers(session.user.id);

		return { success: true, users };
	} catch (error) {
		console.error("Get suggested users error:", error);
		return { error: "Failed to get suggested users" };
	}
}

export async function searchPeople(query: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to search users" };
		}

		const users = await searchUsers(query, session.user.id);

		return { success: true, users };
	} catch (error) {
		console.error("Search users error:", error);
		return { error: "Failed to search users" };
	}
}

export async function checkFollowStatus(targetUsername: string) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return { success: false, isFollowing: false };
		}

		const isFollowing = await isUserFollowing(
			session.user.id,
			targetUsername
		);
		return { success: true, isFollowing };
	} catch (error) {
		console.error("Error checking follow status:", error);
		return { success: false, isFollowing: false };
	}
}
