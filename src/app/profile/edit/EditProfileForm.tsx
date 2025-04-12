"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/profile-actions";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";

interface EditProfileFormProps {
	user: {
		_id: string;
		name?: string | null;
		email?: string | null;
		username?: string;
		bio?: string;
		location?: string;
		website?: string;
		avatar?: string;
	};
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [previewImage, setPreviewImage] = useState<string | null>(
		user.avatar || null
	);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageClick = () => {
		fileInputRef.current?.click();
	};

	const handleImageChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		// Validate file type
		if (!file.type.startsWith("image/")) {
			toast({
				title: "Error",
				description: "Please select an image file",
				variant: "destructive",
			});
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			toast({
				title: "Error",
				description: "Image size should be less than 5MB",
				variant: "destructive",
			});
			return;
		}

		// Show preview and upload
		try {
			const reader = new FileReader();
			reader.onloadend = async () => {
				const dataUrl = reader.result as string;
				setPreviewImage(dataUrl); // Set preview immediately
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error("Error reading file:", error);
			toast({
				title: "Error",
				description: "Failed to read image file. Please try again.",
				variant: "destructive",
			});
		}
	};

	async function handleSubmit(formData: FormData) {
		setIsLoading(true);
		try {
			// Add the preview image URL to the form data if it exists
			if (previewImage) {
				formData.set("avatar", previewImage);
			}
			const result = await updateProfile(formData);

			if (result.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			} else if (result.user) {
				toast({
					title: "Success",
					description: "Profile updated successfully",
				});
				router.push(`/profile/${result.user.username}`);
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<form action={handleSubmit} className='space-y-6'>
				<div className='flex flex-col items-center gap-4 mb-6'>
					<div
						className='relative cursor-pointer'
						onClick={handleImageClick}>
						<Avatar className='w-24 h-24'>
							<AvatarImage
								className='object-cover'
								src={previewImage || user.avatar}
							/>
							<AvatarFallback>
								{user.name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className='absolute bottom-0 right-0 p-1 bg-primary rounded-full'>
							<Camera className='w-4 h-4 text-primary-foreground' />
						</div>
					</div>
					<input
						type='file'
						ref={fileInputRef}
						accept='image/*'
						className='hidden'
						onChange={handleImageChange}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='name'>Name</Label>
					<Input
						id='name'
						name='name'
						defaultValue={user.name || ""}
						required
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='username'>Username</Label>
					<Input
						id='username'
						name='username'
						defaultValue={user.username || ""}
						required
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='bio'>Bio</Label>
					<Textarea
						id='bio'
						name='bio'
						defaultValue={user.bio || ""}
						className='min-h-[100px]'
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='location'>Location</Label>
					<Input
						id='location'
						name='location'
						defaultValue={user.location || ""}
					/>
				</div>

				<div className='space-y-2'>
					<Label htmlFor='website'>Website</Label>
					<Input
						id='website'
						name='website'
						type='url'
						defaultValue={user.website || ""}
					/>
				</div>

				<div className='flex justify-end gap-4'>
					<Button
						type='button'
						variant='outline'
						onClick={() => router.back()}>
						Cancel
					</Button>
					<Button type='submit' disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</>
	);
}
