"use client";

import { useEffect, useState } from "react";
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
import { getAllStories, updateStoryStatus } from "@/app/actions/admin-actions";
import { useToast } from "@/components/ui/use-toast";

interface Story {
	_id: string;
	userId: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	media: string;
	createdAt: string;
	expiresAt: string;
	viewers: string[];
	status: "active" | "expired" | "flagged";
	trending?: boolean;
}

interface APIResponse<T> {
	error?: string;
	success?: boolean;
	message?: string;
	stories?: T[];
	story?: T;
}

interface AdminStoriesListProps {
	filterStatus?: "active" | "expired" | "flagged";
	filterTrending?: boolean;
}

export function AdminStoriesList({
	filterStatus,
	filterTrending,
}: AdminStoriesListProps) {
	const { toast } = useToast();
	const [loading, setLoading] = useState(true);
	const [stories, setStories] = useState<Story[]>([]);

	useEffect(() => {
		const fetchStories = async () => {
			try {
				const result = (await getAllStories()) as APIResponse<Story>;
				if (!result || result.error) {
					throw new Error(result?.error || "Failed to fetch stories");
				}
				if (result.stories) {
					setStories(result.stories);
				}
			} catch (error) {
				console.error("Error fetching stories:", error);
				toast({
					title: "Error",
					description: "Failed to fetch stories",
					variant: "destructive",
				});
			} finally {
				setLoading(false);
			}
		};

		fetchStories();
	}, [toast]);

	const handleUpdateStatus = async (
		storyId: string,
		status: "active" | "expired" | "flagged"
	) => {
		try {
			const result = (await updateStoryStatus(
				storyId,
				status
			)) as APIResponse<Story>;

			if (!result || result.error) {
				throw new Error(
					result?.error || "Failed to update story status"
				);
			}

			setStories(
				stories.map((story) =>
					story._id === storyId ? { ...story, status } : story
				)
			);

			toast({
				title: "Success",
				description:
					result.message || "Story status updated successfully",
			});
		} catch (error) {
			console.error("Error updating story status:", error);
			toast({
				title: "Error",
				description: "Failed to update story status",
				variant: "destructive",
			});
		}
	};

	const filteredStories = stories.filter((story) => {
		if (filterStatus && story.status !== filterStatus) return false;
		if (filterTrending && !story.trending) return false;
		return true;
	});

	if (loading) {
		return (
			<div className='p-4 text-center text-sm text-muted-foreground'>
				Loading stories...
			</div>
		);
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
			{filteredStories.length === 0 ? (
				<div className='col-span-full p-4 text-center text-sm text-muted-foreground'>
					No stories found
				</div>
			) : (
				filteredStories.map((story) => (
					<div
						key={story._id}
						className='rounded-md border overflow-hidden'>
						<div className='relative aspect-[9/16] bg-muted'>
							<Image
								src={story.media || "/placeholder.svg"}
								alt='Story preview'
								fill
								className='object-cover'
							/>
							<div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4'>
								<div className='flex items-center gap-2'>
									<Avatar className='h-8 w-8'>
										<AvatarImage
											src={story.userId.avatar}
											alt={story.userId.name}
										/>
										<AvatarFallback>
											{story.userId.name.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className='flex items-center gap-1'>
											<span className='text-sm font-medium text-white'>
												{story.userId.name}
											</span>
											{story.userId.isVerified && (
												<BadgeCheck className='h-4 w-4 text-blue-500' />
											)}
										</div>
										<div className='text-xs text-gray-300'>
											@{story.userId.username}
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
												handleUpdateStatus(
													story._id,
													"active"
												)
											}>
											Set as Active
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												handleUpdateStatus(
													story._id,
													"expired"
												)
											}>
											Mark as Expired
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												handleUpdateStatus(
													story._id,
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
									<span>{story.viewers.length} views</span>
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
