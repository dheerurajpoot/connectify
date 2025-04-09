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
import { likeUnlikePost, addPostComment } from "@/app/actions/post-actions";
import { useSession } from "next-auth/react";
import { useToast } from "../hooks/use-toast";
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
	const [commentText, setCommentText] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { toast } = useToast();
	const { data: session } = useSession();

	const handleLike = async () => {
		try {
			// Optimistic update
			if (liked) {
				setLikesCount(likesCount - 1);
			} else {
				setLikesCount(likesCount + 1);
			}
			setLiked(!liked);

			// Server update
			const result = await likeUnlikePost(post.id, liked);

			if (result?.error) {
				// Revert optimistic update if there's an error
				setLiked(liked);
				setLikesCount(liked ? likesCount : likesCount - 1);

				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			}
		} catch (error) {
			// Revert optimistic update if there's an error
			setLiked(liked);
			setLikesCount(liked ? likesCount : likesCount - 1);

			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		}
	};

	const handleComment = async () => {
		if (!commentText.trim()) return;

		setIsSubmitting(true);

		try {
			const result = await addPostComment(post.id, commentText);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			} else {
				setCommentText("");
				// In a real app, you would add the new comment to the comments list
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className='overflow-hidden'>
			<CardHeader className='flex flex-row items-center gap-3 p-4'>
				<Link href={`/profile/${post.user.username}`}>
					<Avatar>
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
							className='rounded-full'>
							<MoreHorizontal className='h-5 w-5' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuItem>Report Post</DropdownMenuItem>
						<DropdownMenuItem>
							Unfollow @{post.user.username}
						</DropdownMenuItem>
						<DropdownMenuItem>Copy Link</DropdownMenuItem>
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
					<div className='relative aspect-square w-full'>
						<Image
							src={post.media[0] || "/placeholder.svg"}
							alt='Post image'
							fill
							className='object-cover'
						/>
					</div>
				)}
			</CardContent>
			<CardFooter className='flex flex-col p-0'>
				<div className='flex items-center justify-between px-4 py-2'>
					<div className='flex items-center gap-3'>
						<Button
							variant='ghost'
							size='icon'
							onClick={handleLike}
							disabled={!session}>
							<Heart
								className={`h-5 w-5 ${
									liked ? "fill-red-500 text-red-500" : ""
								}`}
							/>
						</Button>
						<Button
							variant='ghost'
							size='icon'
							onClick={() => setShowComments(!showComments)}>
							<MessageCircle className='h-5 w-5' />
						</Button>
						<Button variant='ghost' size='icon'>
							<Share2 className='h-5 w-5' />
						</Button>
					</div>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => setBookmarked(!bookmarked)}
						disabled={!session}>
						<Bookmark
							className={`h-5 w-5 ${
								bookmarked ? "fill-current" : ""
							}`}
						/>
					</Button>
				</div>

				<div className='px-4 py-1'>
					<p className='text-sm font-medium'>{likesCount} likes</p>
				</div>

				{showComments && (
					<div className='border-t p-4'>
						<div className='mb-4 space-y-3'>
							<div className='flex items-start gap-2'>
								<Avatar className='h-7 w-7'>
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
										<span>Like</span>
										<span>Reply</span>
									</div>
								</div>
							</div>
						</div>

						{session ? (
							<div className='flex items-center gap-2'>
								<Avatar className='h-7 w-7'>
									<AvatarImage
										src={
											session.user?.image ||
											"/placeholder.svg?height=28&width=28"
										}
										alt={session.user?.name || "User"}
									/>
									<AvatarFallback>
										{session.user?.name?.slice(0, 2) || "U"}
									</AvatarFallback>
								</Avatar>
								<div className='relative flex-1'>
									<Input
										value={commentText}
										onChange={(e) =>
											setCommentText(e.target.value)
										}
										placeholder='Add a comment...'
										className='pr-10'
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleComment();
											}
										}}
									/>
									<Button
										variant='ghost'
										size='icon'
										className='absolute right-1 top-1/2 -translate-y-1/2'
										onClick={handleComment}
										disabled={
											isSubmitting || !commentText.trim()
										}>
										<Send className='h-4 w-4' />
									</Button>
								</div>
							</div>
						) : (
							<p className='text-center text-sm text-muted-foreground'>
								<Link
									href='/auth/login'
									className='text-primary hover:underline'>
									Log in
								</Link>{" "}
								to add a comment
							</p>
						)}
					</div>
				)}
			</CardFooter>
		</Card>
	);
}
