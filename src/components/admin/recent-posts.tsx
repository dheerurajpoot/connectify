"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, MoreHorizontal } from "lucide-react";
import { useState } from "react";

type Post = {
	id: string;
	content: string;
	user: {
		id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	createdAt: string;
	likes: number;
	comments: number;
	status: "active" | "hidden" | "flagged";
};

export function RecentPosts() {
	const [posts, setPosts] = useState<Post[]>([
		{
			id: "1",
			content: "Just finished my latest photography project! 📸",
			user: {
				id: "1",
				name: "Alex Johnson",
				username: "alexj",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: true,
			},
			createdAt: "2023-06-15T10:30:00Z",
			likes: 245,
			comments: 32,
			status: "active",
		},
		{
			id: "2",
			content: "Beautiful sunset at the beach today! 🌅",
			user: {
				id: "2",
				name: "Emma Wilson",
				username: "emma",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: false,
			},
			createdAt: "2023-06-14T18:45:00Z",
			likes: 189,
			comments: 24,
			status: "active",
		},
		{
			id: "3",
			content: "Check out my new apartment! Moving in next week. 🏠",
			user: {
				id: "3",
				name: "Michael Chen",
				username: "michael",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: true,
			},
			createdAt: "2023-06-13T14:20:00Z",
			likes: 312,
			comments: 45,
			status: "flagged",
		},
		{
			id: "4",
			content: "Just discovered this amazing coffee shop downtown! ☕",
			user: {
				id: "4",
				name: "Sophie Taylor",
				username: "sophie",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: false,
			},
			createdAt: "2023-06-12T09:15:00Z",
			likes: 156,
			comments: 18,
			status: "hidden",
		},
	]);

	const updatePostStatus = (
		postId: string,
		status: "active" | "hidden" | "flagged"
	) => {
		setPosts(
			posts.map((post) =>
				post.id === postId ? { ...post, status } : post
			)
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Recent Posts</CardTitle>
				<CardDescription>
					Manage content across your platform
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{posts.map((post) => (
						<div key={post.id} className='rounded-lg border p-4'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-3'>
									<Avatar>
										<AvatarImage
											src={post.user.avatar}
											alt={post.user.name}
										/>
										<AvatarFallback>
											{post.user.name.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className='flex items-center gap-1'>
											<span className='font-medium'>
												{post.user.name}
											</span>
											{post.user.isVerified && (
												<BadgeCheck className='h-4 w-4 text-blue-500' />
											)}
										</div>
										<div className='text-xs text-muted-foreground'>
											@{post.user.username} •{" "}
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
											<DropdownMenuItem
												onClick={() =>
													(window.location.href = `/post/${post.id}`)
												}>
												View Post
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													updatePostStatus(
														post.id,
														"active"
													)
												}>
												Set as Active
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													updatePostStatus(
														post.id,
														"hidden"
													)
												}>
												Hide Post
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													updatePostStatus(
														post.id,
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
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
