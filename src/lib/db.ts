import { connectDB } from "./mongodb";
import { hash, compare } from "bcryptjs";
import {
	User,
	Post,
	Comment,
	Story,
	Message,
	Notification,
	IUser,
	IPost,
	IComment,
	IStoryDocument,
	IStoryCreate,
	IMessage,
	INotification,
} from "@/models";
import mongoose, { Types } from "mongoose";

// User operations
export async function createUser(userData: {
	name: string;
	username: string;
	email: string;
	password: string;
	bio?: string;
	location?: string;
	website?: string;
	avatar?: string;
}) {
	await connectDB();

	// Check if user already exists
	const existingUser = await User.findOne({
		$or: [{ email: userData.email }, { username: userData.username }],
	});

	if (existingUser) {
		throw new Error("User with this email or username already exists");
	}

	// Hash password
	const hashedPassword = await hash(userData.password, 10);

	const newUser = new User({
		...userData,
		password: hashedPassword,
		followers: [],
		following: [],
	});

	await newUser.save();
	return newUser;
}

export async function getUserById(id: string) {
	await connectDB();
	return User.findById(id);
}

export async function getUserByUsername(
	username: string
): Promise<(IUser & { _id: Types.ObjectId }) | null> {
	await connectDB();

	const sanitizedUsername = String(username).trim().toLowerCase();

	const user = await User.findOne({ username: sanitizedUsername })
		.populate("followers", "name username avatar")
		.populate("following", "name username avatar")
		.exec();

	if (!user) {
		return null;
	}

	return user as IUser & { _id: Types.ObjectId };
}

export async function getUserByEmail(email: string) {
	await connectDB();
	return User.findOne({ email });
}

export async function updateUser(id: string, userData: Partial<IUser>) {
	await connectDB();
	return User.findByIdAndUpdate(
		id,
		{ ...userData, updatedAt: new Date() },
		{ new: true }
	);
}

export async function followUser(userId: string, targetUserId: string) {
	await connectDB();

	// Add target user to following list
	await User.findByIdAndUpdate(userId, {
		$addToSet: { following: targetUserId },
	});

	// Add current user to target user's followers list
	await User.findByIdAndUpdate(targetUserId, {
		$addToSet: { followers: userId },
	});

	return { success: true };
}

export async function unfollowUser(userId: string, targetUserId: string) {
	await connectDB();

	// Remove target user from following list
	await User.findByIdAndUpdate(userId, {
		$pull: { following: targetUserId },
	});

	// Remove current user from target user's followers list
	await User.findByIdAndUpdate(targetUserId, {
		$pull: { followers: userId },
	});

	return { success: true };
}

export async function getSuggestedUsers(userId: string, limit = 5) {
	await connectDB();

	const user = await User.findById(userId);
	if (!user) throw new Error("User not found");

	const users = await User.find({
		_id: { $nin: [...user.following, userId] },
	})
		.limit(limit)
		.select("name username avatar")
		.lean();

	// Convert ObjectIds to strings and ensure proper serialization
	return users.map(user => ({
		_id: user._id.toString(),
		name: user.name,
		username: user.username,
		avatar: user.avatar || "",
	}));
}

export async function searchUsers(query: string, currentUserId: string) {
	await connectDB();

	if (!query) return [];

	const users = await User.find({
		$and: [
			{ _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } },
			{
				$or: [
					{ name: { $regex: query, $options: "i" } },
					{ username: { $regex: query, $options: "i" } },
				],
			},
		],
	})
		.select("name username avatar")
		.lean()
		.limit(10);

	return users.map((user) => ({
		...user,
		_id: user._id.toString(),
	}));
}

// Post operations
export async function createPost(
	postData: Omit<
		IPost,
		"_id" | "createdAt" | "updatedAt" | "likes" | "comments"
	>
) {
	await connectDB();

	const newPost = new Post({
		...postData,
		likes: [],
		comments: [],
	});

	await newPost.save();
	return newPost;
}

export async function getPostById(id: string) {
	await connectDB();
	return Post.findById(id)
		.populate("userId", "_id name username avatar")
		.populate({
			path: "comments",
			populate: {
				path: "userId",
				select: "name username avatar",
			},
		})
		.lean();
}

export async function getFeedPosts(userId: string, page = 1, limit = 100) {
	await connectDB();

	const user = await User.findById(userId);
	if (!user) throw new Error("User not found");

	const skip = (page - 1) * limit;

	// Get posts from following users and latest posts from all users
	return Post.find({
		$or: [
			{
				createdAt: {
					$gte: new Date(Date.now() - 48 * 60 * 60 * 1000),
				},
			},
			{ userId: { $in: [...user.following, userId] } },
		],
	})
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.populate("userId", "name username avatar")
		.populate({
			path: "comments",
			populate: {
				path: "userId",
				select: "name username avatar",
			},
		});
}

export async function getUserPosts(userId: string) {
	await connectDB();
	return Post.find({ userId })
		.sort({ createdAt: -1 })
		.populate("userId", "name username avatar");
}

export async function likePost(postId: string, userId: string) {
	await connectDB();

	const post = await Post.findById(postId);
	if (!post) throw new Error("Post not found");

	if (!post.likes.includes(new mongoose.Types.ObjectId(userId))) {
		post.likes.push(new mongoose.Types.ObjectId(userId));
		await post.save();
	}

	return post;
}

export async function unlikePost(postId: string, userId: string) {
	await connectDB();

	const post = await Post.findById(postId);
	if (!post) throw new Error("Post not found");

	post.likes = post.likes.filter((id) => id.toString() !== userId);
	await post.save();

	return post;
}

export async function addComment(
	postId: string,
	commentData: Omit<IComment, "_id" | "createdAt">
) {
	await connectDB();

	const post = await Post.findById(postId);
	if (!post) throw new Error("Post not found");

	const newComment = new Comment({
		...commentData,
		postId,
		userId: commentData.userId,
	});

	await newComment.save();

	post.comments.push(newComment._id as unknown as mongoose.Types.ObjectId);
	await post.save();

	// Populate and convert to plain object
	const populatedComment = await newComment.populate(
		"userId",
		"_id name username avatar"
	);

	return populatedComment.toObject();
}

// Story operations
export async function createStory(storyData: IStoryCreate) {
	await connectDB();

	// Set expiration to 24 hours from now
	const expiresAt = new Date();
	expiresAt.setHours(expiresAt.getHours() + 24);

	const newStory = new Story({
		...storyData,
		viewers: [],
		expiresAt,
	});

	await newStory.save();
	return newStory;
}

export async function getActiveStories(userId: string) {
	await connectDB();

	const user = await User.findById(userId);
	if (!user) throw new Error("User not found");

	const now = new Date();

	const stories = await Story.find({
		userId: { $in: [...user.following, userId] },
		expiresAt: { $gt: now },
	})
		.sort({ createdAt: -1 })
		.populate("userId", "name username avatar")
		.lean();

	// Transform the populated data into the expected format
	return stories.map(story => ({
		_id: story._id.toString(),
		userId: story.userId._id.toString(),
		media: story.media,
		viewers: story.viewers?.map((v: any) => v.toString()) || [],
		createdAt: story.createdAt.toISOString(),
		expiresAt: story.expiresAt.toISOString(),
		user: {
			name: (story.userId as any).name,
			username: (story.userId as any).username,
			avatar: (story.userId as any).avatar
		}
	}));
}

export async function viewStory(storyId: string, userId: string) {
	await connectDB();

	const story = await Story.findById(storyId);
	if (!story) throw new Error("Story not found");

	if (!story.viewers.includes(new mongoose.Types.ObjectId(userId))) {
		story.viewers.push(new mongoose.Types.ObjectId(userId));
		await story.save();
	}

	return story;
}

// Message operations
export async function sendMessage(
	messageData: Omit<IMessage, "_id" | "createdAt" | "read">
) {
	await connectDB();

	const newMessage = new Message({
		...messageData,
		read: false,
	});

	await newMessage.save();
	return newMessage;
}

export async function getConversation(
	user1Id: string,
	user2Id: string,
	limit = 50
) {
	await connectDB();

	return Message.find({
		$or: [
			{ senderId: user1Id, receiverId: user2Id },
			{ senderId: user2Id, receiverId: user1Id },
		],
	})
		.sort({ createdAt: -1 })
		.limit(limit)
		.populate("senderId", "name username avatar")
		.populate("receiverId", "name username avatar");
}

export async function getUserConversations(userId: string) {
	await connectDB();

	// Get all messages where the user is either sender or receiver
	const messages = await Message.find({
		$or: [{ senderId: userId }, { receiverId: userId }],
	})
		.sort({ createdAt: -1 })
		.populate("senderId", "name username avatar")
		.populate("receiverId", "name username avatar");

	// Group messages by conversation
	const conversations: Record<string, any> = {};

	messages.forEach((message) => {
		const otherUserId =
			message.senderId._id.toString() === userId
				? message.receiverId._id.toString()
				: message.senderId._id.toString();

		if (!conversations[otherUserId]) {
			conversations[otherUserId] = {
				user:
					message.senderId._id.toString() === userId
						? message.receiverId
						: message.senderId,
				lastMessage: message,
				unreadCount: 0,
			};
		}

		// Count unread messages
		if (message.receiverId._id.toString() === userId && !message.read) {
			conversations[otherUserId].unreadCount++;
		}
	});

	return Object.values(conversations);
}

export async function markMessagesAsRead(senderId: string, receiverId: string) {
	await connectDB();

	await Message.updateMany(
		{
			senderId,
			receiverId,
			read: false,
		},
		{ read: true }
	);

	return { success: true };
}

// Notification operations
export async function createNotification({
	userId,
	actorId,
	type,
	postId,
	commentId,
}: {
	userId: string;
	actorId: string;
	type: "like" | "comment" | "follow" | "mention" | "share";
	postId?: string;
	commentId?: string;
}) {
	try {
		await connectDB();

		// Convert string IDs to ObjectIds
		const data = {
			userId: new Types.ObjectId(userId),
			actorId: new Types.ObjectId(actorId),
			type,
			postId: postId ? new Types.ObjectId(postId) : undefined,
			commentId: commentId ? new Types.ObjectId(commentId) : undefined,
			read: false,
		};

		const newNotification = new Notification(data);
		await newNotification.save();

		// Populate the actor details before returning
		const populatedNotification = await newNotification.populate(
			"actorId",
			"name username avatar"
		);

		return populatedNotification.toObject();
	} catch (error) {
		console.error("Create notification error:", error);
		throw error;
	}
}

export async function getUserNotifications(
	userId: string,
	page = 1,
	limit = 20
) {
	await connectDB();

	const skip = (page - 1) * limit;

	return Notification.find({ userId: new Types.ObjectId(userId) })
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.populate("actorId", "name username avatar")
		.populate("postId")
		.populate("commentId")
		.lean()
		.exec();
}

export async function markNotificationAsRead(notificationId: string) {
	await connectDB();

	return Notification.findByIdAndUpdate(
		notificationId,
		{ read: true },
		{ new: true }
	);
}

export async function markAllNotificationsAsRead(userId: string) {
	await connectDB();

	await Notification.updateMany({ userId, read: false }, { read: true });

	return { success: true };
}

export async function deletePost(postId: string) {
	await connectDB();
	await Post.findByIdAndDelete(postId);
	return { success: true };
}

// Authentication
export async function verifyCredentials(email: string, password: string) {
	await connectDB();

	const user = await User.findOne({ email });
	if (!user) return null;

	const isPasswordValid = await compare(password, user.password);
	if (!isPasswordValid) return null;

	return user;
}

export async function isUserFollowing(followerId: string, targetUsername: string) {
	await connectDB();

	try {
		const targetUser = await User.findOne({ username: targetUsername }).lean<IUser & { _id: Types.ObjectId }>().exec();
		if (!targetUser) return false;

		const follower = await User.findById(followerId).lean<IUser & { _id: Types.ObjectId }>().exec();
		if (!follower) return false;

		return follower.following.some((id: Types.ObjectId) => id.toString() === targetUser._id.toString());
	} catch (error) {
		console.error('Error checking follow status:', error);
		return false;
	}
}
