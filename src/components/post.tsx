"use client";

import { useState } from "react";
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
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "timeago.js";
import { likeUnlikePost } from "@/app/actions/post-actions";

interface PostProps {
	post: {
		_id: string;
		userId: {
			_id: string;
			name: string;
			username: string;
			avatar: string;
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
	const [liked, setLiked] = useState(
		post.likes?.includes(post.userId._id) || false
	);
	const [bookmarked, setBookmarked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
	const [commentsCount, setCommentsCount] = useState(
		post.comments?.length || 0
	);
	const [sharesCount, setSharesCount] = useState(post.shares?.length || 0);

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

	const handleShare = async () => {
		// await sharePost(post._id);
		setSharesCount(sharesCount + 1);
		// In a real app, you would implement actual sharing functionality
	};

	return (
		<Card className='overflow-hidden border-none flex-col gap-0.5 py-0 shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-900 dark:shadow-gray-800/20'>
			<CardHeader className='flex flex-row items-center gap-3 p-4'>
				<Link
					href={`/profile/${post.userId.username}`}
					className='transition-transform duration-200 hover:scale-105'>
					<Avatar className='border-2 border-primary/10'>
						<AvatarImage
							src={post.userId.avatar}
							alt={post.userId.name}
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
						<DropdownMenuItem className='cursor-pointer rounded-lg'>
							Report Post
						</DropdownMenuItem>
						<DropdownMenuItem className='cursor-pointer rounded-lg'>
							Unfollow @{post.userId.username}
						</DropdownMenuItem>
						<DropdownMenuItem className='cursor-pointer rounded-lg'>
							Copy Link
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
								onClick={() => setShowComments(!showComments)}
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
							{post.comments?.map((comment) => (
								<div
									key={comment._id}
									className='flex items-start gap-2'>
									<Avatar className='h-7 w-7 border border-primary/10'>
										<AvatarImage
											src={comment.user.avatar}
											alt={comment.user.name}
										/>
										<AvatarFallback>
											{comment.user.name.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div className='flex-1'>
										<div className='rounded-xl bg-muted p-2 text-sm'>
											<span className='font-medium'>
												{comment.user.username}
											</span>{" "}
											{comment.content}
										</div>
										<div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
											<span>
												{format(comment.timePosted)}
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
									placeholder='Add a comment...'
									className='rounded-full border-gray-200 bg-gray-50 pr-10 focus-visible:ring-primary/50 dark:border-gray-700 dark:bg-gray-800'
								/>
								<Button
									variant='ghost'
									size='icon'
									className='absolute right-1 top-1/2 -translate-y-1/2 rounded-full text-primary hover:bg-primary/10'>
									<Send className='h-4 w-4' />
								</Button>
							</div>
						</div>
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
