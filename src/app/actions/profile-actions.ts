"use server";

import { getUserByUsername, followUser, unfollowUser } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getProfileData(username: string) {
	try {
		const user = await getUserByUsername(username);
		if (!user) {
			return { error: "User not found" };
		}

		const session = await getServerSession(authOptions);
		const isFollowing = user.followers?.some(
			(follower) => follower._id.toString() === session?.user?.id
		);
		const isOwnProfile = session?.user?.id === user._id.toString();

		return {
			user,
			isFollowing,
			isOwnProfile,
		};
	} catch (error) {
		console.error("Error fetching profile data:", error);
		return { error: "Failed to fetch profile data" };
	}
}

export async function handleFollow(username: string, isFollowing: boolean) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return { error: "Not authenticated" };
		}

		const user = await getUserByUsername(username);
		if (!user) {
			return { error: "User not found" };
		}

		if (isFollowing) {
			await unfollowUser(session.user.id, user._id.toString());
		} else {
			await followUser(session.user.id, user._id.toString());
		}

		return { success: true };
	} catch (error) {
		console.error("Error in follow action:", error);
		return { error: "Failed to update follow status" };
	}
}
