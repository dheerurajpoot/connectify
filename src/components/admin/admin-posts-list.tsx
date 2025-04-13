"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, MoreHorizontal } from "lucide-react";
import { getAllPosts, updatePostStatus } from "@/app/actions/admin-actions";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface APIResponse<T> {
	error?: string;
	message?: string;
	posts?: T[];
}

interface Post {
	_id: string;
	content: string;
	user: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	createdAt: string;
	likes: number;
	comments: number;
	status: "active" | "hidden" | "flagged";
	trending?: boolean;
}

interface AdminPostsListProps {
	filterStatus?: "active" | "hidden" | "flagged";
	filterTrending?: boolean;
}

export function AdminPostsList({
	filterStatus,
	filterTrending,
}: AdminPostsListProps) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const result = (await getAllPosts()) as APIResponse<Post>;
				if (!result || result.error) {
					throw new Error(result?.error || "Failed to fetch posts");
				}
				if (result.posts) {
					setPosts(result.posts);
				}
			} catch (error) {
				console.error("Error fetching posts:", error);
				toast({
					title: "Error",
					description: "Failed to load posts",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [toast]);

	const handleUpdateStatus = async (
		postId: string,
		status: "active" | "hidden" | "flagged"
	) => {
		try {
			const result = (await updatePostStatus(
				postId,
				status
			)) as APIResponse<Post>;
			if (!result || result.error) {
				throw new Error(
					result?.error || "Failed to update post status"
				);
			}

			setPosts(
				posts.map((post) =>
					post._id === postId ? { ...post, status } : post
				)
			);

			toast({
				title: "Success",
				description:
					result.message || "Post status updated successfully",
			});
		} catch (error) {
			console.error("Error updating post status:", error);
			toast({
				title: "Error",
				description: "Failed to update post status",
				variant: "destructive",
			});
		}
	};

	if (loading) {
		return (
			<div className='p-4 text-center text-sm text-muted-foreground'>
				Loading posts...
			</div>
		);
	}

	// Filter posts based on props
	const filteredPosts = posts.filter((post) => {
		if (filterStatus && post.status !== filterStatus) return false;
		if (filterTrending && !post.trending) return false;
		return true;
	});

	return (
		<div className='space-y-4'>
			{filteredPosts.length === 0 ? (
				<div className='rounded-md border p-4 text-center text-sm text-muted-foreground'>
					No posts found
				</div>
			) : (
				filteredPosts.map((post) => (
					<div key={post._id} className='rounded-md border p-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<Avatar>
									<AvatarImage
										src={post.user?.avatar}
										alt={post.user?.name}
									/>
									<AvatarFallback>
										{post.user?.name.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className='flex items-center gap-1'>
										<span className='font-medium flex items-center gap-1'>
											{post.user?.name}
											{post.user?.isVerified && (
												<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
											)}
										</span>
									</div>
									<div className='text-xs text-muted-foreground'>
										@{post.user?.username} •{" "}
										{new Date(
											post.createdAt
										).toLocaleString()}
									</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
										post.status === "active"
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: post.status === "hidden"
											? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
											: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
									}`}>
									{post.status.charAt(0).toUpperCase() +
										post.status.slice(1)}
								</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' size='icon'>
											<MoreHorizontal className='h-4 w-4' />
											<span className='sr-only'>
												Actions
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>
											Actions
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<Link href={`/post/${post._id}`}>
												View Post
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												handleUpdateStatus(
													post._id,
													"active"
												)
											}>
											Set as Active
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												handleUpdateStatus(
													post._id,
													"hidden"
												)
											}>
											Hide Post
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												handleUpdateStatus(
													post._id,
													"flagged"
												)
											}>
											Flag for Review
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<div className='mt-2 text-sm'>{post.content}</div>
						<div className='mt-3 flex items-center gap-4 text-xs text-muted-foreground'>
							<div>{post.likes} likes</div>
							<div>{post.comments} comments</div>
							{post.trending && (
								<div className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
									Trending
								</div>
							)}
						</div>
					</div>
				))
			)}
		</div>
	);
}
