"use client";

import { useState } from "react";
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
import { BadgeCheck, MoreHorizontal, Eye } from "lucide-react";
import Image from "next/image";

type Story = {
	id: string;
	user: {
		id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	image: string;
	createdAt: string;
	expiresAt: string;
	views: number;
	status: "active" | "expired" | "flagged";
	trending?: boolean;
};

interface AdminStoriesListProps {
	filterStatus?: "active" | "expired" | "flagged";
	filterTrending?: boolean;
}

export function AdminStoriesList({
	filterStatus,
	filterTrending,
}: AdminStoriesListProps) {
	const [stories, setStories] = useState<Story[]>([
		{
			id: "1",
			user: {
				id: "1",
				name: "Alex Johnson",
				username: "alexj",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: true,
			},
			image: "/placeholder.svg?height=200&width=100",
			createdAt: "2023-06-15T10:30:00Z",
			expiresAt: "2023-06-16T10:30:00Z",
			views: 245,
			status: "active",
			trending: true,
		},
		{
			id: "2",
			user: {
				id: "2",
				name: "Emma Wilson",
				username: "emma",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: false,
			},
			image: "/placeholder.svg?height=200&width=100",
			createdAt: "2023-06-14T18:45:00Z",
			expiresAt: "2023-06-15T18:45:00Z",
			views: 189,
			status: "active",
			trending: true,
		},
		{
			id: "3",
			user: {
				id: "3",
				name: "Michael Chen",
				username: "michael",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: true,
			},
			image: "/placeholder.svg?height=200&width=100",
			createdAt: "2023-06-13T14:20:00Z",
			expiresAt: "2023-06-14T14:20:00Z",
			views: 312,
			status: "flagged",
		},
		{
			id: "4",
			user: {
				id: "4",
				name: "Sophie Taylor",
				username: "sophie",
				avatar: "/placeholder.svg?height=40&width=40",
				isVerified: false,
			},
			image: "/placeholder.svg?height=200&width=100",
			createdAt: "2023-06-12T09:15:00Z",
			expiresAt: "2023-06-13T09:15:00Z",
			views: 156,
			status: "expired",
		},
	]);

	// Filter stories based on props
	const filteredStories = stories.filter((story) => {
		if (filterStatus && story.status !== filterStatus) return false;
		if (filterTrending && !story.trending) return false;
		return true;
	});

	const updateStoryStatus = (
		storyId: string,
		status: "active" | "expired" | "flagged"
	) => {
		setStories(
			stories.map((story) =>
				story.id === storyId ? { ...story, status } : story
			)
		);
	};

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{filteredStories.length === 0 ? (
				<div className='col-span-full rounded-md border p-4 text-center text-sm text-muted-foreground'>
					No stories found
				</div>
			) : (
				filteredStories.map((story) => (
					<div
						key={story.id}
						className='rounded-md border overflow-hidden'>
						<div className='relative aspect-[9/16] bg-muted'>
							<Image
								src={story.image || "/placeholder.svg"}
								alt='Story preview'
								fill
								className='object-cover'
							/>
							<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
								<div className='flex items-center gap-2'>
									<Avatar className='h-8 w-8'>
										<AvatarImage
											src={story.user.avatar}
											alt={story.user.name}
										/>
										<AvatarFallback>
											{story.user.name.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className='flex items-center gap-1'>
											<span className='text-sm font-medium text-white'>
												{story.user.name}
											</span>
											{story.user.isVerified && (
												<BadgeCheck className='h-4 w-4 text-blue-500' />
											)}
										</div>
										<div className='text-xs text-gray-300'>
											@{story.user.username}
										</div>
									</div>
								</div>
							</div>
							<div className='absolute right-2 top-2'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											size='icon'
											className='rounded-full bg-black/20 text-white hover:bg-black/40'>
											<MoreHorizontal className='h-4 w-4' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>
											Actions
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() =>
												(window.location.href = `/stories/${story.id}`)
											}>
											View Story
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateStoryStatus(
													story.id,
													"active"
												)
											}>
											Set as Active
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateStoryStatus(
													story.id,
													"expired"
												)
											}>
											Mark as Expired
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateStoryStatus(
													story.id,
													"flagged"
												)
											}>
											Flag for Review
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<div className='p-3'>
							<div className='flex items-center justify-between'>
								<div className='flex items-center gap-1 text-sm'>
									<Eye className='h-4 w-4 text-muted-foreground' />
									<span>{story.views} views</span>
								</div>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
										story.status === "active"
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: story.status === "expired"
											? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
											: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
									}`}>
									{story.status.charAt(0).toUpperCase() +
										story.status.slice(1)}
								</span>
							</div>
							<div className='mt-2 text-xs text-muted-foreground'>
								Posted:{" "}
								{new Date(story.createdAt).toLocaleString()}
							</div>
							<div className='text-xs text-muted-foreground'>
								Expires:{" "}
								{new Date(story.expiresAt).toLocaleString()}
							</div>
							{story.trending && (
								<div className='mt-2'>
									<span className='rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'>
										Trending
									</span>
								</div>
							)}
						</div>
					</div>
				))
			)}
		</div>
	);
}
