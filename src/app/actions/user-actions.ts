"use server";

import {
	getSuggestedUsers,
	searchUsers,
	isUserFollowing,
	createVerificationRequest,
} from "@/lib/db";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
	VerificationRequestModel as VerificationRequest,
	Types,
} from "@/lib/db/models";
import { uploadImage } from "@/lib/image-utils";

export async function getSuggested() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to get suggested users" };
		}

		// Ensure database connection is established
		await connectDB();

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

		// Ensure database connection is established
		await connectDB();

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

		// Ensure database connection is established
		await connectDB();

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

export async function submitVerificationRequest(data: {
	links: string[];
	about: string;
	category: string;
	governmentId: File | string;
}) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return { success: false, error: "Not authenticated" };
		}

		// Ensure database connection is established
		await connectDB();

		// Convert File to Buffer for uploadImage
		const mediaFile = data.governmentId as File;
		const buffer = Buffer.from(await mediaFile.arrayBuffer());
		const mediaUrl = await uploadImage(buffer);

		// Create a new object with the correct type for createVerificationRequest
		const verificationData = {
			links: data.links.filter(link => link.trim() !== ""),  // Filter out empty links
			about: data.about.trim(),
			category: data.category,
			governmentId: mediaUrl
		};

		const result = await createVerificationRequest(session.user.id, verificationData);
		
		// Return only necessary data to avoid circular references
		return { 
			success: true, 
			request: {
				id: result.request._id.toString(),
				status: result.request.status,
				createdAt: result.request.createdAt
			}
		};
	} catch (error: any) {
		console.error("Error submitting verification request:", error);
		return { success: false, error: error.message || "Failed to submit verification request" };
	}
}

export async function getMyVerificationStatus() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user) {
			return { success: false, error: "Not authenticated" };
		}

		// Ensure database connection is established
		await connectDB();

		const requests = await VerificationRequest.find({
			userId: new Types.ObjectId(session.user.id),
		})
			.sort({ createdAt: -1 })
			.limit(1)
			.lean();

		return {
			success: true,
			status: requests[0]?.status || null,
			isVerified: session.user.isVerified,
		};
	} catch (error: any) {
		console.error("Error getting verification status:", error);
		return { success: false, error: error.message };
	}
}
