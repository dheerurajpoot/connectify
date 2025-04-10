"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	// In a real app, fetch the current user data here
	const [formData, setFormData] = useState({
		name: "Alex Johnson",
		username: "alexjohnson",
		bio: "Digital creator and photography enthusiast. Sharing moments from around the world. ✈️ 🌍 📸",
		website: "https://alexjohnson.com",
		location: "San Francisco, CA",
		occupation: "Photographer at Studio Creative",
		profilePicture: "/placeholder.svg?height=96&width=96",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// In a real app, send the updated profile data to your API
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
			router.push(`/profile/${formData.username}`);
			router.refresh();
		} catch (error) {
			console.error("Failed to update profile:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='container max-w-2xl px-4 py-6'>
			<div className='mb-6 flex items-center'>
				<Link href={`/profile/${formData.username}`} className='mr-4'>
					<ArrowLeft className='h-5 w-5' />
				</Link>
				<h1 className='text-xl font-bold'>Edit Profile</h1>
			</div>

			<form onSubmit={handleSubmit}>
				<Card className='mb-6'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-lg'>
							Profile Picture
						</CardTitle>
					</CardHeader>
					<CardContent className='flex flex-col items-center'>
						<div className='relative mb-4'>
							<Avatar className='h-24 w-24 border-2 border-background'>
								<AvatarImage
									src={formData.profilePicture}
									alt='Profile picture'
								/>
								<AvatarFallback>
									{formData.name.slice(0, 2).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<Button
								size='icon'
								variant='secondary'
								className='absolute bottom-0 right-0 h-8 w-8 rounded-full'
								type='button'>
								<Camera className='h-4 w-4' />
								<span className='sr-only'>
									Change profile picture
								</span>
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className='mb-6'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-lg'>
							Basic Information
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid gap-2'>
							<Label htmlFor='name'>Name</Label>
							<Input
								id='name'
								name='name'
								value={formData.name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='username'>Username</Label>
							<Input
								id='username'
								name='username'
								value={formData.username}
								onChange={handleChange}
								required
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='bio'>Bio</Label>
							<Textarea
								id='bio'
								name='bio'
								value={formData.bio}
								onChange={handleChange}
								rows={4}
							/>
						</div>
					</CardContent>
				</Card>

				<Card className='mb-6'>
					<CardHeader className='pb-4'>
						<CardTitle className='text-lg'>
							Additional Information
						</CardTitle>
					</CardHeader>
					<CardContent className='space-y-4'>
						<div className='grid gap-2'>
							<Label htmlFor='website'>Website</Label>
							<Input
								id='website'
								name='website'
								type='url'
								value={formData.website}
								onChange={handleChange}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='location'>Location</Label>
							<Input
								id='location'
								name='location'
								value={formData.location}
								onChange={handleChange}
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='occupation'>Occupation</Label>
							<Input
								id='occupation'
								name='occupation'
								value={formData.occupation}
								onChange={handleChange}
							/>
						</div>
					</CardContent>
				</Card>

				<div className='flex justify-end gap-4'>
					<Button
						variant='outline'
						type='button'
						onClick={() => router.back()}>
						Cancel
					</Button>
					<Button type='submit' disabled={isLoading}>
						{isLoading ? "Saving..." : "Save Changes"}
					</Button>
				</div>
			</form>
		</div>
	);
}
