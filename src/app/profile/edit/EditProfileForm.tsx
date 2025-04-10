"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/profile-actions";
import { useToast } from "@/components/ui/use-toast";

interface EditProfileFormProps {
	user: {
		id: string;
		name?: string | null;
		email?: string | null;
		image?: string | null;
		username?: string;
		bio?: string;
		location?: string;
		website?: string;
		avatar?: string;
	};
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
	console.log("user", user);
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);

	async function handleSubmit(formData: FormData) {
		setIsLoading(true);
		try {
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
		<form action={handleSubmit} className='space-y-6'>
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

			<div className='space-y-2'>
				<Label htmlFor='avatar'>Avatar URL</Label>
				<Input
					id='avatar'
					name='avatar'
					type='url'
					defaultValue={user.avatar || ""}
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
	);
}
