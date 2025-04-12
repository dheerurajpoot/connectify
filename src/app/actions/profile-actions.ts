"use server";

import {
	getUserByUsername,
	followUser,
	unfollowUser,
	updateUser,
	getUserPosts,
	createNotification,
} from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getProfileData(username: string) {
	try {
		const user = await getUserByUsername(username);
		if (!user) {
			return { error: "User not found" };
		}
		const posts = await getUserPosts(user._id.toString());

		const session = await getServerSession(authOptions);
		const isFollowing = user.followers?.some(
			(follower) => follower._id.toString() === session?.user?.id
		);
		const isOwnProfile = session?.user?.id === user._id.toString();

		return {
			user,
			posts,
			isFollowing,
			isOwnProfile,
		};
	} catch (error) {
		console.error("Error fetching profile data:", error);
		return { error: "Failed to fetch profile data" };
	}
}

export async function handleFollow(
	username: string,
	isFollowing: boolean,
	formData: FormData
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			throw new Error("Not authenticated");
		}

		const user = await getUserByUsername(username);
		if (!user) {
			throw new Error("User not found");
		}

		if (isFollowing) {
			await unfollowUser(session.user.id, user._id.toString());
		} else {
			await followUser(session.user.id, user._id.toString());
		}

		// Create notification for the target user
		await createNotification({
			userId: user._id.toString(),
			type: "follow",
			actorId: session.user.id,
		});

		return { success: true };
	} catch (error) {
		console.error("Error in follow action:", error);
		throw new Error("Failed to update follow status");
	}
}

export async function updateProfile(formData: FormData) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return { error: "Not authenticated" };
		}

		const name = formData.get("name") as string;
		const username = formData.get("username") as string;
		const bio = formData.get("bio") as string;
		const location = formData.get("location") as string;
		const website = formData.get("website") as string;
		const avatar = formData.get("avatar") as string;

		// Validate inputs
		if (!name || !username) {
			return { error: "Name and username are required" };
		}

		// Check if username is taken by another user
		const existingUser = await getUserByUsername(username);
		if (existingUser && existingUser._id.toString() !== session.user.id) {
			return { error: "Username is already taken" };
		}

		const updatedUser = await updateUser(session.user.id, {
			name,
			username,
			bio,
			location,
			website,
			avatar,
		});

		if (!updatedUser) {
			return { error: "Failed to update profile" };
		}

		// Convert MongoDB document to plain object
		const plainUser = {
			...updatedUser.toObject(),
			_id: updatedUser._id?.toString() || "",
		};

		return { success: true, user: plainUser };
	} catch (error) {
		console.error("Error updating profile:", error);
		return { error: "Failed to update profile" };
	}
}
