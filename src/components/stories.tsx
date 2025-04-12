"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, X, ImagePlus } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	getStories,
	createNewStory,
	viewUserStory,
} from "@/app/actions/story-actions";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useToast } from "../hooks/use-toast";

interface Story {
	_id: string;
	userId: string;
	media: string;
	viewers: string[];
	createdAt: string;
	expiresAt: string;
	user?: {
		name: string;
		username: string;
		avatar: string;
	};
}

export function Stories() {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [stories, setStories] = useState<Story[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedStory, setSelectedStory] = useState<Story | null>(null);
	const [storyFile, setStoryFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
	const { toast } = useToast();
	const { data: session, status } = useSession();
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const fetchStories = async () => {
			try {
				const result = await getStories();
				if (result.success) {
					// Data is already transformed in getActiveStories
					setStories(result.stories);
				}
			} catch (error) {
				console.error("Failed to fetch stories:", error);
			} finally {
				setLoading(false);
			}
		};

		if (status === "authenticated") {
			fetchStories();
			// Refresh stories every minute
			const interval = setInterval(fetchStories, 60000);
			return () => clearInterval(interval);
		}
	}, [status]);

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const { current } = scrollRef;
			const scrollAmount = 200;
			if (direction === "left") {
				current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
			} else {
				current.scrollBy({ left: scrollAmount, behavior: "smooth" });
			}
		}
	};

	const handleStoryClick = async (story: Story, index: number) => {
		setSelectedStory(story);
		setCurrentStoryIndex(index);

		// Mark story as viewed
		if (session?.user?.id) {
			try {
				await viewUserStory(story._id);
				// Update local state to reflect the view
				setStories((prevStories) =>
					prevStories.map((s) =>
						s._id === story._id
							? { ...s, viewers: [...s.viewers, session.user.id] }
							: s
					)
				);
			} catch (error) {
				console.error("Failed to mark story as viewed:", error);
			}
		}

		// Auto-advance to next story after 5 seconds
		const timer = setTimeout(() => {
			if (index < stories.length - 1) {
				handleStoryClick(stories[index + 1], index + 1);
			} else {
				setSelectedStory(null);
			}
		}, 5000);

		return () => clearTimeout(timer);
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setStoryFile(e.target.files[0]);
		}
	};

	const handleUploadStory = async () => {
		if (!storyFile || !session?.user?.id) return;

		setIsUploading(true);

		try {
			const formData = new FormData();
			formData.append("media", storyFile);

			const result = await createNewStory(formData);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			} else {
				toast({
					title: "Success",
					description: "Story created successfully!",
				});

				// Refresh stories
				const storiesResult = await getStories();
				if (storiesResult.success) {
					setStories(
						storiesResult.stories.map((story: any) => ({
							...story,
							_id: story._id.toString(),
						}))
					);
				}

				setStoryFile(null);
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsUploading(false);
		}
	};

	if (status === "unauthenticated") {
		return null;
	}

	return (
		<>
			<div className='relative mb-6'>
				<div className='absolute -left-4 top-1/2 hidden -translate-y-1/2 transform md:block'>
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8 rounded-full bg-background shadow-md hidden'
						onClick={() => scroll("left")}>
						<ChevronLeft className='h-4 w-4' />
					</Button>
				</div>

				<div
					ref={scrollRef}
					className='flex gap-4 overflow-x-auto pb-2 pt-1 scrollbar-hide'>
					{/* Your story */}
					<div className='flex flex-col items-center gap-1'>
						<div className='relative rounded-full p-[2px]'>
							<Avatar className='h-16 w-16 border-2 border-background'>
								<AvatarImage
									src={session?.user?.image || ""}
									alt='Your story'
									className='object-cover'
								/>
								<AvatarFallback>
									{session?.user?.name?.slice(0, 2) || "YS"}
								</AvatarFallback>
							</Avatar>
							<Dialog>
								<DialogTitle></DialogTitle>
								<DialogDescription></DialogDescription>
								<DialogTrigger asChild>
									<div className='absolute bottom-0 right-0 rounded-full bg-primary p-1 text-primary-foreground cursor-pointer'>
										<Plus className='h-3 w-3' />
									</div>
								</DialogTrigger>
								<DialogContent className='sm:max-w-md'>
									<div className='space-y-4'>
										<h3 className='text-lg font-medium'>
											Create Story
										</h3>
										{storyFile ? (
											<div className='relative aspect-square w-full overflow-hidden rounded-md'>
												<Image
													src={
														URL.createObjectURL(
															storyFile
														) || "/placeholder.svg"
													}
													alt='Story preview'
													fill
													className='object-cover'
												/>
												<Button
													size='icon'
													variant='destructive'
													className='absolute right-2 top-2 h-7 w-7 rounded-full'
													onClick={() =>
														setStoryFile(null)
													}>
													<X className='h-4 w-4' />
												</Button>
											</div>
										) : (
											<div
												className='flex h-40 items-center justify-center rounded-md border border-dashed'
												onClick={() =>
													fileInputRef.current?.click()
												}>
												<div className='text-center'>
													<ImagePlus className='mx-auto h-8 w-8 text-muted-foreground' />
													<p className='mt-2 text-sm text-muted-foreground'>
														Click to upload an image
													</p>
												</div>
												<input
													type='file'
													accept='image/*'
													className='hidden'
													ref={fileInputRef}
													onChange={handleFileChange}
												/>
											</div>
										)}
										<Button
											className='w-full'
											onClick={handleUploadStory}
											disabled={
												!storyFile || isUploading
											}>
											{isUploading
												? "Uploading..."
												: "Create Story"}
										</Button>
									</div>
								</DialogContent>
							</Dialog>
						</div>
						<span className='text-xs text-muted-foreground'>
							Your story
						</span>
					</div>

					{/* Other stories */}
					{stories.map((story, index) => (
						<Dialog key={story._id}>
							<DialogTrigger asChild>
								<div
									className='flex flex-col items-center gap-1 cursor-pointer'
									onClick={() =>
										handleStoryClick(story, index)
									}>
									<div className='relative rounded-full p-[2px] bg-gradient-to-tr from-pink-500 to-orange-400'>
										<Avatar className='h-16 w-16 border-2 border-background'>
											<AvatarImage
												src={story.user?.avatar || ""}
												alt={story.user?.name || "User"}
												className='object-cover'
											/>
											<AvatarFallback>
												{story.user?.name?.slice(
													0,
													2
												) || "U"}
											</AvatarFallback>
										</Avatar>
									</div>
									<span className='text-xs text-muted-foreground'>
										{story.user?.name || "User"}
									</span>
								</div>
							</DialogTrigger>
							<DialogContent className='sm:max-w-md p-0 overflow-hidden'>
								<div className='relative aspect-[9/16] w-full'>
									<Image
										src={
											story.media ||
											"/placeholder.svg?height=800&width=450"
										}
										alt='Story'
										fill
										className='object-cover'
									/>
									<div className='absolute inset-x-0 top-0 flex items-center justify-between p-4'>
										<div className='flex items-center gap-2'>
											<Avatar className='h-8 w-8'>
												<AvatarImage
													src={
														story.user?.avatar || ""
													}
													alt={
														story.user?.name ||
														"User"
													}
													className='object-cover'
												/>
												<AvatarFallback>
													{story.user?.name?.slice(
														0,
														2
													) || "U"}
												</AvatarFallback>
											</Avatar>
											<span className='text-sm font-medium text-white'>
												{story.user?.name}
											</span>
										</div>
									</div>
								</div>
							</DialogContent>
						</Dialog>
					))}
				</div>

				<div className='absolute -right-4 top-1/2 hidden -translate-y-1/2 transform md:block'>
					<Button
						variant='ghost'
						size='icon'
						className='h-8 w-8 rounded-full bg-background shadow-md'
						onClick={() => scroll("right")}>
						<ChevronRight className='h-4 w-4' />
					</Button>
				</div>
			</div>

			{/* Story viewer dialog */}
			{selectedStory && (
				<Dialog
					open={!!selectedStory}
					onOpenChange={(open) => !open && setSelectedStory(null)}>
					<DialogContent className='sm:max-w-md p-0 overflow-hidden'>
						<div className='relative aspect-[9/16] w-full'>
							<div className='relative w-full h-full bg-black'>
								<Image
									src={
										selectedStory.media ||
										"/placeholder.svg?height=800&width=450"
									}
									alt='Story'
									fill
									className='object-contain'
								/>
								<div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200'>
									<div
										className='h-full bg-white transition-all duration-[5000ms] ease-linear'
										style={{ width: "100%" }}
									/>
								</div>
							</div>
							<div className='absolute inset-x-0 top-0 flex items-center justify-between p-4'>
								<div className='flex items-center gap-2'>
									<Avatar className='h-8 w-8'>
										<AvatarImage
											src={
												selectedStory.user?.avatar || ""
											}
											alt={
												selectedStory.user?.name ||
												"User"
											}
											className='object-cover'
										/>
										<AvatarFallback>
											{selectedStory.user?.name?.slice(
												0,
												2
											) || "U"}
										</AvatarFallback>
									</Avatar>
									<span className='text-sm font-medium text-white'>
										{selectedStory.user?.name}
									</span>
								</div>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
