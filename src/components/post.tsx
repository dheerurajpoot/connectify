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

interface PostProps {
	post: {
		id: string;
		user: {
			name: string;
			username: string;
			avatar: string;
		};
		timePosted: string;
		content: string;
		media: string[];
		likes: number;
		comments: number;
		shares: number;
	};
}

export function Post({ post }: PostProps) {
	const [liked, setLiked] = useState(false);
	const [bookmarked, setBookmarked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [likesCount, setLikesCount] = useState(post.likes);
	const [commentsCount, setCommentsCount] = useState(post.comments);
	const [sharesCount, setSharesCount] = useState(post.shares);

	const handleLike = () => {
		if (liked) {
			setLikesCount(likesCount - 1);
		} else {
			setLikesCount(likesCount + 1);
		}
		setLiked(!liked);
	};

	const handleShare = () => {
		setSharesCount(sharesCount + 1);
		// In a real app, you would implement actual sharing functionality
	};

	return (
		<Card className='overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-900 dark:shadow-gray-800/20'>
			<CardHeader className='flex flex-row items-center gap-3 p-4'>
				<Link
					href={`/profile/${post.user.username}`}
					className='transition-transform duration-200 hover:scale-105'>
					<Avatar className='border-2 border-primary/10'>
						<AvatarImage
							src={post.user.avatar}
							alt={post.user.name}
						/>
						<AvatarFallback>
							{post.user.name.slice(0, 2)}
						</AvatarFallback>
					</Avatar>
				</Link>
				<div className='flex-1'>
					<div className='flex items-center gap-1'>
						<Link
							href={`/profile/${post.user.username}`}
							className='font-semibold hover:underline'>
							{post.user.name}
						</Link>
					</div>
					<p className='text-xs text-muted-foreground'>
						{post.timePosted}
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
							Unfollow @{post.user.username}
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
						<Image
							src={post.media[0] || "/placeholder.svg"}
							alt='Post image'
							fill
							className='object-cover transition-transform duration-500 hover:scale-105'
						/>
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
										? "bg-red-50 dark:bg-red-900/20"
										: "hover:bg-gray-100 dark:hover:bg-gray-800"
								}`}>
								<Heart
									className={`h-5 w-5 ${
										liked ? "fill-red-500 text-red-500" : ""
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
							<div className='flex items-start gap-2'>
								<Avatar className='h-7 w-7 border border-primary/10'>
									<AvatarImage
										src='/placeholder.svg?height=28&width=28'
										alt='Comment user'
									/>
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
								<div className='flex-1'>
									<div className='rounded-xl bg-muted p-2 text-sm'>
										<span className='font-medium'>
											johndoe
										</span>{" "}
										Amazing shot! The lighting is perfect.
									</div>
									<div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
										<span>1h</span>
										<span className='cursor-pointer hover:text-primary'>
											Like
										</span>
										<span className='cursor-pointer hover:text-primary'>
											Reply
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<Avatar className='h-7 w-7 border border-primary/10'>
								<AvatarImage
									src='/placeholder.svg?height=28&width=28'
									alt='User'
								/>
								<AvatarFallback>ME</AvatarFallback>
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
