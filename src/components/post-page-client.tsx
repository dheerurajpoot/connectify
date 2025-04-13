"use client";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
	Heart,
	MessageCircle,
	Share2,
	Bookmark,
	MoreHorizontal,
	Copy,
	Check,
	BadgeCheck,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SinglePostComments from "@/components/single-post-comments";
import {
	addPostComment,
	deleteUserPost,
	likeUnlikePost,
} from "@/app/actions/post-actions";
import { handleFollow } from "@/app/actions/profile-actions";
import { checkFollowStatus } from "@/app/actions/user-actions";
import { format } from "timeago.js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Post {
	_id: string;
	content: string;
	media: string[];
	likes: string[];
	shares: string[];
	userId: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	comments: any[];
	createdAt: string;
	updatedAt: string;
}

interface PostPageClientProps {
	post: Post;
}

export function PostPageClient({ post }: PostPageClientProps) {
	const { data: session } = useSession();
	const router = useRouter();
	const { toast } = useToast();
	const isOwner = session?.user?.id === post.userId._id;
	const [liked, setLiked] = useState(
		post.likes?.includes(post.userId._id) || false
	);
	const [comment, setComment] = useState("");
	const [isFollowing, setIsFollowing] = useState(false);
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
			return toast({
				title: "Please login to follow users",
				variant: "destructive",
			});
		}

		try {
			const result = await handleFollow(
				post.userId.username,
				isFollowing,
				new FormData()
			);

			setIsFollowing(!isFollowing);
			toast({
				title: isFollowing
					? `Unfollowed ${post.userId.username}`
					: `Following ${post.userId.username}`,
			});
		} catch (error) {
			console.error("Follow/unfollow error:", error);
			toast({
				title: "Failed to follow/unfollow user",
				variant: "destructive",
			});
		}
	};

	// Handle copy link
	const handleCopyLink = () => {
		const postUrl = `${window.location.origin}/post/${post._id}`;
		navigator.clipboard.writeText(postUrl);
		setCopied(true);
		toast({
			title: "Post link copied to clipboard",
		});
		setTimeout(() => setCopied(false), 3000);
	};

	const handleDeletePost = async () => {
		try {
			const result = await deleteUserPost(post._id);
			if (result.success) {
				router.refresh();
				router.push("/");
			} else {
				throw new Error(result.error);
			}
		} catch (error) {
			console.error("Delete post error:", error);
		}
	};

	const handleLike = async () => {
		try {
			const result = await likeUnlikePost(post._id, liked);
			if (result.success) {
				setLiked(!liked);
			}
		} catch (error) {
			console.error("Error liking post:", error);
		}
	};

	const handleComment = async () => {
		try {
			const result = await addPostComment(post._id, comment);
			if (result.success) {
				// Refresh the page to update the feed
				window.location.reload();
				setComment("");
			}
		} catch (error) {
			console.error("Error commenting on post:", error);
		}
	};

	return (
		<div className='container mx-auto max-w-6xl mt-10 md:mt-0 px-4 py-6 md:py-8'>
			<Card className='overflow-hidden border-none shadow-md flex flex-col md:flex-row'>
				{/* Left side - Image */}
				<div className='relative aspect-square w-full bg-black md:h-full md:w-[55%]'>
					<Image
						src={post?.media[0] || "/placeholder.svg"}
						alt='Post image'
						fill
						className='object-contain'
						priority
					/>
				</div>

				{/* Right side - Post details */}
				<div className='flex w-full flex-col md:h-full md:w-[45%]'>
					{/* Header with user info */}
					<div className='flex items-center gap-3 border-b p-4 dark:border-gray-800'>
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
									className='font-semibold hover:underline flex items-center gap-1'>
									{post.userId.name}
									{post.userId.isVerified && (
										<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
									)}
								</Link>
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
								{!isOwner && (
									<DropdownMenuItem
										className='cursor-pointer rounded-lg'
										onClick={handleFollowAction}>
										{isFollowing ? "Unfollow" : "Follow"} @
										{post.userId.username}
									</DropdownMenuItem>
								)}
								<DropdownMenuItem
									className='cursor-pointer rounded-lg'
									onClick={handleCopyLink}>
									{copied ? (
										<>
											<Check className='w-4 h-4 mr-2' />
											Copied
										</>
									) : (
										<>
											<Copy className='w-4 h-4 mr-2' />
											Copy Link
										</>
									)}
								</DropdownMenuItem>
								{isOwner && (
									<DropdownMenuItem
										className='cursor-pointer rounded-lg text-red-500 focus:text-red-500'
										onClick={handleDeletePost}>
										Delete Post
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Post content */}
					<div className='p-4'>
						<p className='whitespace-pre-line text-sm'>
							{post.content}
						</p>
					</div>

					{/* Comments section - scrollable */}
					<div className='flex-1 overflow-y-auto border-t border-b dark:border-gray-800'>
						<SinglePostComments comments={post.comments} />
					</div>

					{/* Post actions */}
					<div className='p-4'>
						<div className='flex items-center justify-between pb-3'>
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
									<span className='text-sm font-medium'>
										{post.likes?.length}
									</span>
								</div>

								<div className='flex items-center gap-1.5'>
									<Button
										variant='ghost'
										size='icon'
										className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
										<MessageCircle className='h-5 w-5' />
									</Button>
									<span className='text-sm font-medium'>
										{post.comments?.length}
									</span>
								</div>

								<div className='flex items-center gap-1.5'>
									<Button
										variant='ghost'
										size='icon'
										className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
										<Share2 className='h-5 w-5' />
									</Button>
									<span className='text-sm font-medium'>
										{post?.shares?.length}
									</span>
								</div>
							</div>

							<Button
								variant='ghost'
								size='icon'
								className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
								<Bookmark className='h-5 w-5' />
							</Button>
						</div>

						<Separator className='my-2' />

						{/* Add comment form */}
						<form className='flex items-center gap-2 pt-2'>
							<input
								type='text'
								onChange={(e) => setComment(e.target.value)}
								value={comment}
								placeholder='Add a comment...'
								className='flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800'
							/>
							<Button
								size='sm'
								onClick={handleComment}
								className='rounded-full'>
								Post
							</Button>
						</form>
					</div>
				</div>
			</Card>
		</div>
	);
}
