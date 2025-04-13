"use server";

import {
	createPost,
	likePost,
	unlikePost,
	addComment,
	getFeedPosts,
	getPostById,
	deletePost,
} from "@/lib/db";
import { createNotification } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Types } from "mongoose";
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
	userId: string;
	type: "like" | "comment" | "share";
	actorId: string;
	postId: string;
	commentId?: string;
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
			if (post && post.userId._id.toString() !== session.user.id) {
				const notificationData: NotificationInput = {
					userId: post.userId._id.toString(),
					type: "like",
					actorId: session.user.id,
					postId: postId,
				};
				await createNotification(notificationData);
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
		if (post && post.userId._id.toString() !== session.user.id) {
			const notificationData: NotificationInput = {
				userId: post.userId._id.toString(),
				type: "comment",
				actorId: session.user.id,
				postId: postId,
				commentId: comment?._id?.toString(),
			};
			await createNotification(notificationData);
		}

		// Format dates and IDs
		const plainComment = {
			...comment,
			_id: (comment as any)._id.toString(),
			userId: {
				_id: (comment as any).userId._id.toString(),
				name: (comment as any).userId.name,
				username: (comment as any).userId.username,
				avatar: (comment as any).userId.avatar,
				isVerified: (comment as any).userId.isVerified,
			},
			postId: (comment as any).postId.toString(),
			createdAt: new Date((comment as any).createdAt).toISOString(),
			updatedAt: new Date((comment as any).updatedAt).toISOString(),
		};

		return { success: true, comment: plainComment };
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
		const plainPosts = posts.map((post: any) => {
			const plainPost = {
				...post.toObject(),
				_id: (post as any)._id.toString(),
				userId: {
					...(post as any).userId.toObject(),
					_id: (post as any).userId._id.toString(),
				},
				media: post.media || [],
				likes: post.likes?.map((id: any) => id.toString()) || [],
				comments:
					post.comments?.map((comment: any) => ({
						_id: comment._id.toString(),
						content: comment.content,
						userId: {
							_id: comment.userId._id.toString(),
							name: comment.userId.name,
							username: comment.userId.username,
							avatar: comment.userId.avatar,
							isVerified: comment.userId.isVerified,
						},
						createdAt: comment.createdAt.toISOString(),
						updatedAt: comment.updatedAt.toISOString(),
					})) || [],
				createdAt: (post as any).createdAt.toISOString(),
				updatedAt: (post as any).updatedAt.toISOString(),
			};
			return plainPost;
		});

		return { success: true, posts: plainPosts };
	} catch (error) {
		console.error("Get feed error:", error);
		return { error: "Failed to get feed" };
	}
}

export async function getPost(id: string) {
	try {
		const post = await getPostById(id);
		if (!post) {
			return { error: "Post not found" };
		}

		// Convert MongoDB document to plain object
		const plainPost = {
			_id: (post as any)._id.toString(),
			content: (post as any).content,
			media: (post as any).media || [],
			likes: (post as any).likes?.map((id: any) => id.toString()) || [],
			shares: (post as any).shares?.map((id: any) => id.toString()) || [],
			userId: {
				_id: (post as any).userId._id.toString(),
				name: (post as any).userId.name,
				username: (post as any).userId.username,
				avatar: (post as any).userId.avatar,
				isVerified: (post as any).userId.isVerified,
			},
			comments:
				(post as any).comments?.map((comment: any) => ({
					_id: comment._id.toString(),
					content: comment.content,
					userId: {
						_id: comment.userId._id.toString(),
						name: comment.userId.name,
						username: comment.userId.username,
						avatar: comment.userId.avatar,
						isVerified: comment.userId.isVerified,
					},
					createdAt: comment.createdAt.toISOString(),
					updatedAt: comment.updatedAt.toISOString(),
				})) || [],
			createdAt: (post as any).createdAt.toISOString(),
			updatedAt: (post as any).updatedAt.toISOString(),
		};

		return { success: true, post: plainPost };
	} catch (error) {
		console.error("Get post error:", error);
		return { error: "Failed to get post" };
	}
}

export async function deleteUserPost(postId: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to delete a post" };
		}

		const post = await getPostById(postId);
		if (!post) {
			return { error: "Post not found" };
		}

		// Check if the user is the owner of the post
		if (post.userId._id.toString() !== session.user.id) {
			return { error: "You can only delete your own posts" };
		}

		await deletePost(postId);
		revalidatePath("/");
		return { success: true };
	} catch (error) {
		console.error("Delete post error:", error);
		return { error: "Failed to delete post" };
	}
}

export async function sharePost(postId: string) {
	try {
		const session = await getServerSession(authOptions);

		if (!session || !session.user) {
			return { error: "You must be logged in to share a post" };
		}

		const post = await getPostById(postId);
		if (!post) {
			return { error: "Post not found" };
		}

		// Create a new post with shared content
		const sharedPostData = {
			userId: new Types.ObjectId(session.user.id),
			content: `Shared from @${(post as any).userId.username}`,
			media: post.media,
			sharedFrom: post._id,
		};

		const sharedPost = await createPost(sharedPostData as any);

		// Convert shared post to plain object
		const plainPost = {
			...sharedPost.toObject(),
			_id: (sharedPost as any)._id.toString(),
			userId: {
				_id: (sharedPost as any).userId.toString(),
				name: session.user.name,
				username: session.user.username,
				avatar: session.user.avatar,
			},
			media: sharedPost.media || [],
			likes: [],
			comments: [],
			createdAt: (sharedPost as any).createdAt.toISOString(),
			updatedAt: (sharedPost as any).updatedAt.toISOString(),
		};

		return { success: true, post: plainPost };
	} catch (error) {
		console.error("Share post error:", error);
		return { error: "Failed to share post" };
	}
}
