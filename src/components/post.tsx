"use client";

import { useState, useTransition, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {
	Heart,
	MessageCircle,
	Share2,
	Bookmark,
	MoreHorizontal,
	Send,
	BadgeCheck,
	Check,
	Copy,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "timeago.js";
import {
	likeUnlikePost,
	addPostComment,
	deleteUserPost,
} from "@/app/actions/post-actions";
import { handleFollow } from "@/app/actions/profile-actions";
import { checkFollowStatus } from "@/app/actions/user-actions";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { PostPreviewDialog } from "./post-preview-dialog";

interface PostProps {
	post: {
		_id: string;
		userId: {
			_id: string;
			name: string;
			username: string;
			avatar: string;
			isVerified: boolean;
		};
		content: string;
		media: string[];
		likes: string[];
		comments: any[];
		shares: string[];
		createdAt: string;
	};
}

export function Post({ post }: PostProps) {
	const { data: session } = useSession();
	const { toast } = useToast();
	const [isPending, startTransition] = useTransition();
	const [liked, setLiked] = useState(
		post.likes?.includes(post.userId._id) || false
	);
	const isOwner = session?.user?.id === post.userId._id;
	const [isFollowing, setIsFollowing] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [comment, setComment] = useState("");
	const [showComments, setShowComments] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
	const [commentsCount, setCommentsCount] = useState(
		post.comments?.length || 0
	);
	const [sharesCount, setSharesCount] = useState(post.shares?.length || 0);
	const [showPreview, setShowPreview] = useState(false);
	const [copied, setCopied] = useState(false);

	// Check initial follow status
	useEffect(() => {
		if (session?.user?.id && !isOwner) {
			checkFollowStatus(post.userId.username).then((result) => {
				if (result.success) {
					setIsFollowing(result.isFollowing);
				}
			});
		}
	}, [session?.user?.id, post.userId.username, isOwner]);

	// Handle follow/unfollow
	const handleFollowAction = async () => {
		if (!session?.user) {
			toast({
				description: "You must be logged in to follow users",
				variant: "destructive",
			});
			return;
		}

		startTransition(async () => {
			try {
				const formData = new FormData();
				await handleFollow(post.userId.username, isFollowing, formData);
				setIsFollowing(!isFollowing);
				toast({
					description: !isFollowing
						? `Following @${post.userId.username}`
						: `Unfollowed @${post.userId.username}`,
				});
			} catch (error) {
				console.error("Error following/unfollowing:", error);
				toast({
					description: "Failed to update follow status",
					variant: "destructive",
				});
			}
		});
	};

	const handleLike = async () => {
		try {
			const result = await likeUnlikePost(post._id, liked);
			if (result.success) {
				setLiked(!liked);
				setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
			}
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	const handleComment = async () => {
		try {
			const result = await addPostComment(post._id, comment);
			if (result.success) {
				setComment("");
				setCommentsCount((prev) => prev + 1);
			}
		} catch (error) {
			console.error("Error commenting on post:", error);
		}
	};

	const handleShare = () => {
		setShowPreview(true);
	};

	const handleShareSuccess = () => {
		setSharesCount((prev) => prev + 1);
	};

	const handleDeletePost = async () => {
		try {
			const result = await deleteUserPost(post._id);
			console.log(result);
			if (result.success) {
				// Refresh the page to update the feed
				window.location.reload();
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<Card className='overflow-hidden border-none flex-col gap-0.5 py-0 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-900 dark:shadow-gray-800/20'>
				<CardHeader className='flex flex-row items-center gap-3 p-4'>
					<Link
						href={`/profile/${post.userId.username}`}
						className='transition-transform duration-200 hover:scale-105'>
						<Avatar className='border-2 border-primary/10'>
							<AvatarImage
								src={post.userId.avatar}
								alt={post.userId.name}
								className='object-cover'
							/>
							<AvatarFallback>
								{post.userId.name.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
					</Link>
					<div className='flex-1'>
						<div className='flex items-center gap-1'>
							<Link
								href={`/profile/${post.userId.username}`}
								className='font-semibold hover:underline'>
								{post.userId.name}
							</Link>
							{post.userId.isVerified && (
								<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
							)}
						</div>
						<p className='text-xs text-muted-foreground'>
							{format(post.createdAt)}
						</p>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
								<MoreHorizontal className='h-5 w-5' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='end'
							className='w-48 rounded-xl p-1'>
							{isOwner ? (
								<DropdownMenuItem
									className='cursor-pointer rounded-lg text-red-500 focus:text-red-500'
									onClick={handleDeletePost}>
									Delete Post
								</DropdownMenuItem>
							) : (
								<>
									<DropdownMenuItem className='cursor-pointer rounded-lg'>
										Report Post
									</DropdownMenuItem>
									<DropdownMenuItem
										className='cursor-pointer rounded-lg'
										onClick={handleFollowAction}
										disabled={isPending}>
										{isPending
											? "Loading..."
											: isFollowing
											? `Unfollow @${post.userId.username}`
											: `Follow @${post.userId.username}`}
									</DropdownMenuItem>
								</>
							)}
							<DropdownMenuItem
								className='cursor-pointer rounded-lg'
								onClick={() => {
									const url = `${window.location.origin}/post/${post._id}`;
									navigator.clipboard.writeText(url);
									setCopied(true);
									toast({
										description:
											"Link copied to clipboard!",
									});
									setTimeout(() => setCopied(false), 3000);
								}}>
								<div className='flex items-center gap-2'>
									{copied ? (
										<Check className='h-4 w-4' />
									) : (
										<Copy className='h-4 w-4' />
									)}
									{copied ? "Copied!" : "Copy Link"}
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</CardHeader>
				<CardContent className='p-0'>
					{post.content && (
						<div className='px-4 py-2'>
							<p className='whitespace-pre-line text-sm'>
								{post.content}
							</p>
						</div>
					)}
					{post.media.length > 0 && (
						<div className='relative aspect-square w-full overflow-hidden'>
							<Link
								href={`/post/${post._id}`}
								className='block relative aspect-square w-full overflow-hidden'>
								<Image
									src={post.media[0] || "/placeholder.svg"}
									alt={post.content || "Post image"}
									sizes='99vw'
									fill
									className='object-cover transition-transform duration-500 hover:scale-105'
								/>
							</Link>
						</div>
					)}
				</CardContent>
				<CardFooter className='flex flex-col p-0'>
					<div className='flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800'>
						<div className='flex items-center gap-6'>
							<div className='flex items-center gap-1.5'>
								<Button
									variant='ghost'
									size='icon'
									onClick={handleLike}
									className={`rounded-full ${
										liked
											? "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20"
											: "hover:bg-gray-100 dark:hover:bg-gray-800"
									}`}>
									<Heart
										className={`h-5 w-5 ${
											liked ? "fill-current" : ""
										}`}
									/>
								</Button>
								<span
									className={`text-sm font-medium ${
										liked ? "text-red-500" : ""
									}`}>
									{likesCount}
								</span>
							</div>

							<div className='flex items-center gap-1.5'>
								<Button
									variant='ghost'
									size='icon'
									onClick={() =>
										setShowComments(!showComments)
									}
									className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
									<MessageCircle className='h-5 w-5' />
								</Button>
								<span className='text-sm font-medium'>
									{commentsCount}
								</span>
							</div>

							<div className='flex items-center gap-1.5'>
								<Button
									variant='ghost'
									size='icon'
									onClick={handleShare}
									className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
									<Share2 className='h-5 w-5' />
								</Button>
								<span className='text-sm font-medium'>
									{sharesCount}
								</span>
							</div>
						</div>

						<Button
							variant='ghost'
							size='icon'
							onClick={() => setBookmarked(!bookmarked)}
							className={`rounded-full ${
								bookmarked
									? "bg-primary/10"
									: "hover:bg-gray-100 dark:hover:bg-gray-800"
							}`}>
							<Bookmark
								className={`h-5 w-5 ${
									bookmarked ? "fill-current" : ""
								}`}
							/>
						</Button>
					</div>

					{showComments && (
						<div className='border-t border-gray-100 p-4 dark:border-gray-800'>
							<div className='mb-4 space-y-3'>
								{post.comments?.map((comment, index) => (
									<div
										key={index}
										className='flex items-center gap-2'>
										<Avatar className='h-7 w-7 border border-primary/10'>
											<AvatarImage
												src={comment.userId?.avatar}
												alt={comment.userId?.name}
											/>
											<AvatarFallback>
												{comment.userId?.name.slice(
													0,
													2
												)}
											</AvatarFallback>
										</Avatar>
										<div className='flex-1'>
											<div className='rounded-xl bg-muted flex flex-col gap-1 p-2 text-sm'>
												<Link
													href={`/profile/${comment.userId?.username}`}
													className='font-medium flex items-center gap-1'>
													{comment.userId?.name}
													{comment.userId
														?.isVerified && (
														<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
													)}
												</Link>
												<span className='text-muted-foreground'>
													{comment.content}
												</span>
											</div>
											<div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
												<span>
													{format(comment.createdAt)}
												</span>
												<span className='cursor-pointer hover:text-primary'>
													Like
												</span>
												<span className='cursor-pointer hover:text-primary'>
													Reply
												</span>
											</div>
										</div>
									</div>
								))}
							</div>

							<div className='flex items-center gap-2'>
								<Avatar className='h-7 w-7 border border-primary/10'>
									<AvatarImage
										src={post.userId.avatar}
										alt={post.userId.name}
									/>
									<AvatarFallback>
										{post.userId.name.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div className='relative flex-1'>
									<Input
										onChange={(e) =>
											setComment(e.target.value)
										}
										value={comment}
										placeholder='Add a comment...'
										className='rounded-full border-gray-200 bg-gray-50 pr-10 focus-visible:ring-primary/50 dark:border-gray-700 dark:bg-gray-800'
									/>
									<Button
										variant='ghost'
										size='icon'
										onClick={handleComment}
										className='absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-primary hover:bg-primary/10'>
										<Send className='h-4 w-4' />
									</Button>
								</div>
							</div>
						</div>
					)}
				</CardFooter>
			</Card>

			<PostPreviewDialog
				post={post}
				open={showPreview}
				onOpenChange={setShowPreview}
				onShareSuccess={handleShareSuccess}
			/>
		</>
	);
}
