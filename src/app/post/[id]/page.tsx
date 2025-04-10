import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SinglePostComments from "@/components/single-post-comments";
import { getPost } from "@/app/actions/post-actions";
import { format } from "timeago.js";
export const metadata: Metadata = {
	title: "Post | Social Media",
	description: "View post details",
};

export default async function PostPage({ params }: { params: { id: string } }) {
	const { id } = await params;
	const { post, error } = await getPost(id);

	if (!post) {
		notFound();
	}

	return (
		<div className='container mx-auto max-w-6xl px-4 py-6 md:py-8'>
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
										className='rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'>
										<Heart className='h-5 w-5' />
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
								placeholder='Add a comment...'
								className='flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800'
							/>
							<Button size='sm' className='rounded-full'>
								Post
							</Button>
						</form>
					</div>
				</div>
			</Card>
		</div>
	);
}
