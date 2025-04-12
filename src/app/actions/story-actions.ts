"use server";

import { createStory, getActiveStories, viewStory } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { uploadImage } from "@/lib/image-utils";
import { Types } from "mongoose";

export async function createNewStory(formData: FormData) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to create a story" };
		}

		const mediaFile = formData.get("media") as File;

		// Validate input
		if (!mediaFile) {
			return { error: "Story must have media" };
		}

		// Convert File to Buffer for uploadImage
		const buffer = Buffer.from(await mediaFile.arrayBuffer());
		const mediaUrl = await uploadImage(buffer);

		const story = await createStory({
			userId: new Types.ObjectId(session.user.id),
			media: mediaUrl,
		});

		revalidatePath("/");
		return { success: true, story };
	} catch (error) {
		console.error("Create story error:", error);
		return { error: "Failed to create story" };
	}
}

export async function getStories() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to view stories" };
		}

		const stories = await getActiveStories(session.user.id);
		
		// Data is already transformed in getActiveStories
		return { success: true, stories };
	} catch (error) {
		console.error("Get stories error:", error);
		return { error: "Failed to get stories" };
	}
}

export async function viewUserStory(storyId: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to view stories" };
		}

		await viewStory(storyId, session.user.id);

		return { success: true };
	} catch (error) {
		console.error("View story error:", error);
		return { error: "Failed to view story" };
	}
}
