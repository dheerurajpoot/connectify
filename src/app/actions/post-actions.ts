"use server";

import {
	createPost,
	likePost,
	unlikePost,
	addComment,
	getFeedPosts,
	getExplorePosts,
	getUserPosts,
	getPostById,
	getUserByUsername,
} from "@/lib/db";
import { createNotification } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
import { IPost, IComment, INotification } from "@/models";
import { uploadImage } from "@/lib/image-utils";

type CreatePostInput = {
	userId: Types.ObjectId;
	content: string;
	media?: string[];
};

type CommentInput = {
	userId: Types.ObjectId;
	postId: Types.ObjectId;
	content: string;
};

type NotificationInput = {
	userId: Types.ObjectId;
	type: "like" | "comment";
	actorId: Types.ObjectId;
	postId: Types.ObjectId;
	commentId?: Types.ObjectId;
};

export async function createNewPost(formData: FormData) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to create a post" };
		}

		const content = formData.get("content") as string;
		const mediaFiles = formData.getAll("media");

		// Validate inputs
		if (!content && mediaFiles.length === 0) {
			return { error: "Post must have content or media" };
		}

		const media = [];
		for (const file of mediaFiles) {
			if (file instanceof File) {
				const arrayBuffer = await file.arrayBuffer();
				const buffer = Buffer.from(arrayBuffer);
				const imgUrl = await uploadImage(buffer);
				media.push(imgUrl);
			}
		}

		const postData: CreatePostInput = {
			userId: new Types.ObjectId(session.user.id),
			content,
			media,
		};

		const post = await createPost(postData as any);
		if (!post) {
			return { error: "Failed to create post" };
		}

		// Convert post to plain object to avoid serialization issues
		const plainPost = {
			...post.toObject(),
			_id: (post as any)._id.toString(),
			userId: (post as any).userId.toString(),
			createdAt: (post as any).createdAt.toISOString(),
			updatedAt: (post as any).updatedAt.toISOString(),
		};

		return { success: true, post: plainPost };
	} catch (error) {
		console.error("Create post error:", error);
		return { error: "Failed to create post" };
	}
}

export async function likeUnlikePost(postId: string, isLiked: boolean) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to like a post" };
		}

		if (isLiked) {
			await unlikePost(postId, session.user.id);
		} else {
			await likePost(postId, session.user.id);

			// Create notification for the post owner
			const post = await getPostById(postId);
			if (post && post.userId.toString() !== session.user.id) {
				const notificationData: NotificationInput = {
					userId: new Types.ObjectId(post.userId.toString()),
					type: "like",
					actorId: new Types.ObjectId(session.user.id),
					postId: new Types.ObjectId(postId),
				};
				await createNotification(notificationData as any);
			}
		}

		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Like/unlike post error:", error);
		return { error: "Failed to like/unlike post" };
	}
}

export async function addPostComment(postId: string, content: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to comment on a post" };
		}

		// Validate input
		if (!content) {
			return { error: "Comment cannot be empty" };
		}

		const commentData: CommentInput = {
			userId: new Types.ObjectId(session.user.id),
			postId: new Types.ObjectId(postId),
			content,
		};

		const comment = await addComment(postId, commentData as any);

		// Create notification for the post owner
		const post = await getPostById(postId);
		if (post && post.userId.toString() !== session.user.id) {
			const notificationData: NotificationInput = {
				userId: new Types.ObjectId(post.userId.toString()),
				type: "comment",
				actorId: new Types.ObjectId(session.user.id),
				postId: new Types.ObjectId(postId),
				commentId: comment?._id
					? new Types.ObjectId(comment._id.toString())
					: undefined,
			};
			await createNotification(notificationData as any);
		}

		revalidatePath("/");
		return { success: true, comment };
	} catch (error) {
		console.error("Add comment error:", error);
		return { error: "Failed to add comment" };
	}
}

export async function getFeed(page = 1) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to view your feed" };
		}

		const posts = await getFeedPosts(session.user.id, page);

		// Convert MongoDB documents to plain objects
		const plainPosts = posts.map((post) => {
			const plainPost = post.toObject();
			return {
				...plainPost,
				_id: (post as any)._id.toString(),
				userId: {
					...(post as any).userId.toObject(),
					_id: (post as any).userId._id.toString(),
				},
				createdAt: (post as any).createdAt.toISOString(),
				updatedAt: (post as any).updatedAt.toISOString(),
			};
		});

		return { success: true, posts: plainPosts };
	} catch (error) {
		console.error("Get feed error:", error);
		return { error: "Failed to get feed" };
	}
}

export async function getExplore(category?: string, page = 1) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to explore posts" };
		}

		const posts = await getExplorePosts(session.user.id, category, page);

		return { success: true, posts };
	} catch (error) {
		console.error("Get explore error:", error);
		return { error: "Failed to get explore posts" };
	}
}

export async function getUserProfile(username: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to view profiles" };
		}

		const user = await getUserByUsername(username);

		if (!user) {
			return { error: "User not found" };
		}

		const posts = await getUserPosts(user._id.toString());

		// Don't return sensitive information
		const { password, ...userWithoutPassword } = user;

		return {
			success: true,
			user: userWithoutPassword,
			posts,
			isCurrentUser: user._id.toString() === session.user.id,
			isFollowing:
				user.followers?.includes(new Types.ObjectId(session.user.id)) ||
				false,
		};
	} catch (error) {
		console.error("Get user profile error:", error);
		return { error: "Failed to get user profile" };
	}
}
