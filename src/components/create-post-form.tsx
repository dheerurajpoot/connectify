"use client";

import type React from "react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, MapPin, SmilePlus, Users, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createNewPost } from "@/app/actions/post-actions";
import { useSession } from "next-auth/react";
import { useToast } from "../../hooks/use-toast";

export function CreatePostForm() {
	const [postText, setPostText] = useState("");
	const [images, setImages] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const router = useRouter();
	const { toast } = useToast();
	const { data: session } = useSession();

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const newImages = Array.from(e.target.files).map((file) =>
				URL.createObjectURL(file)
			);
			setImages([...images, ...newImages]);
		}
	};

	const removeImage = (index: number) => {
		const newImages = [...images];
		newImages.splice(index, 1);
		setImages(newImages);
	};

	const handleSubmit = async () => {
		if (postText.trim() === "" && images.length === 0) return;

		setIsLoading(true);

		try {
			const formData = new FormData();
			formData.append("content", postText);

			// In a real app, you would append the actual image files
			// For now, we'll just simulate it
			if (images.length > 0) {
				formData.append("media", "placeholder.jpg");
			}

			const result = await createNewPost(formData);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			} else {
				toast({
					title: "Success",
					description: "Post created successfully!",
				});
				router.push("/");
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardContent className='p-4'>
				<div className='flex gap-3'>
					<Avatar>
						<AvatarImage
							src={
								session?.user?.image ||
								"/placeholder.svg?height=40&width=40"
							}
							alt={session?.user?.name || "Profile"}
						/>
						<AvatarFallback>
							{session?.user?.name?.slice(0, 2) || "U"}
						</AvatarFallback>
					</Avatar>
					<div className='flex-1'>
						<Textarea
							placeholder="What's on your mind?"
							className='min-h-32 border-none px-0 focus-visible:ring-0'
							value={postText}
							onChange={(e) => setPostText(e.target.value)}
						/>

						{images.length > 0 && (
							<div className='mt-4 grid gap-2'>
								{images.length === 1 ? (
									<div className='relative aspect-video w-full overflow-hidden rounded-lg'>
										<Image
											src={
												images[0] || "/placeholder.svg"
											}
											alt='Upload preview'
											fill
											className='object-cover'
										/>
										<Button
											size='icon'
											variant='destructive'
											className='absolute right-2 top-2 h-7 w-7 rounded-full'
											onClick={() => removeImage(0)}>
											<X className='h-4 w-4' />
										</Button>
									</div>
								) : (
									<div className='grid grid-cols-2 gap-2'>
										{images.map((img, index) => (
											<div
												key={index}
												className='relative aspect-square overflow-hidden rounded-lg'>
												<Image
													src={
														img ||
														"/placeholder.svg"
													}
													alt={`Upload ${index + 1}`}
													fill
													className='object-cover'
												/>
												<Button
													size='icon'
													variant='destructive'
													className='absolute right-2 top-2 h-7 w-7 rounded-full'
													onClick={() =>
														removeImage(index)
													}>
													<X className='h-4 w-4' />
												</Button>
											</div>
										))}
									</div>
								)}
							</div>
						)}
					</div>
				</div>
			</CardContent>
			<CardFooter className='flex-col space-y-4 border-t px-4 py-3'>
				<div className='flex w-full justify-between'>
					<div className='flex gap-2'>
						<Button
							variant='ghost'
							size='sm'
							className='flex items-center gap-1 text-muted-foreground'
							onClick={() => fileInputRef.current?.click()}>
							<ImagePlus className='h-4 w-4' />
							<span className='hidden sm:inline'>Photo</span>
						</Button>
						<input
							type='file'
							accept='image/*'
							multiple
							className='hidden'
							ref={fileInputRef}
							onChange={handleImageUpload}
						/>
						<Button
							variant='ghost'
							size='sm'
							className='flex items-center gap-1 text-muted-foreground'>
							<SmilePlus className='h-4 w-4' />
							<span className='hidden sm:inline'>Feeling</span>
						</Button>
						<Button
							variant='ghost'
							size='sm'
							className='flex items-center gap-1 text-muted-foreground'>
							<MapPin className='h-4 w-4' />
							<span className='hidden sm:inline'>Location</span>
						</Button>
						<Button
							variant='ghost'
							size='sm'
							className='flex items-center gap-1 text-muted-foreground'>
							<Users className='h-4 w-4' />
							<span className='hidden sm:inline'>Tag</span>
						</Button>
					</div>
				</div>
				<Button
					className='w-full'
					disabled={
						isLoading ||
						(postText.trim() === "" && images.length === 0)
					}
					onClick={handleSubmit}>
					{isLoading ? "Posting..." : "Post"}
				</Button>
			</CardFooter>
		</Card>
	);
}
