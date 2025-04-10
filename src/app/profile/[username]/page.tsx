import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProfilePosts } from "@/components/profile-posts";
import { ProfileFollowers } from "@/components/profile-followers";
import { Suspense } from "react";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";
import type { Metadata } from "next";
import { getProfileData, handleFollow } from "@/app/actions/profile-actions";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

type Props = {
	params: { username: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { username } = await params;
	const { user } = await getProfileData(username);

	if (!user) {
		return {
			title: "User not found",
			description: "The requested user could not be found",
		};
	}

	return {
		title: `${user.name} (@${user.username})`,
		description: user.bio || "Connect with me on Connectify",
		openGraph: {
			title: `${user.name} (@${user.username})`,
			description: user.bio || "Connect with me on Connectify",
		},
	};
}

export default async function ProfilePage({ params }: Props) {
	const { username } = await params;
	const session = await getServerSession(authOptions);

	// If not logged in, redirect to login
	if (!session) {
		redirect("/auth/login");
	}

	const { user, isFollowing, isOwnProfile, error } = await getProfileData(
		username
	);

	if (error || !user) {
		notFound();
	}

	return (
		<div className='container px-4 py-6'>
			<div className='mb-6 space-y-4 flex flex-col justify-center mx-auto md:w-2/3'>
				<div className='flex flex-col items-center gap-4 sm:flex-row'>
					<Avatar className='h-24 w-24 border-2 border-background'>
						<AvatarImage
							src={
								user.avatar ||
								`/placeholder.svg?height=96&width=96`
							}
							alt={user.username}
						/>
						<AvatarFallback>
							{user.username.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
					<div className='text-center sm:text-left'>
						<h1 className='text-2xl font-bold'>{user.name}</h1>
						<p className='text-muted-foreground'>
							@{user.username}
						</p>
					</div>
					<div className='ml-auto'>
						{isOwnProfile ? (
							<Button variant='outline' asChild>
								<a href='/profile/edit'>Edit Profile</a>
							</Button>
						) : (
							<form
								action={async () => {
									"use server";
									await handleFollow(
										user.username,
										isFollowing
									);
								}}>
								<Button
									type='submit'
									variant={
										isFollowing ? "outline" : "default"
									}>
									{isFollowing ? "Following" : "Follow"}
								</Button>
							</form>
						)}
					</div>
				</div>
				<div className='space-y-2'>
					<p>Digital creator and photography enthusiast ✈️ 🌍 📸</p>
					<div className='flex items-center gap-2 text-sm'>
						<Link
							href='https://alexjohnson.com'
							target='_blank'
							className='text-primary hover:underline'>
							alexjohnson.com
						</Link>
					</div>
					<p className='text-sm text-muted-foreground'>
						San Francisco, CA • Photographer at Studio Creative
					</p>
				</div>
				<div className='flex justify-around text-center'>
					<div>
						<p className='font-bold'>0</p>
						<p className='text-sm text-muted-foreground'>Posts</p>
					</div>
					<div>
						<p className='font-bold'>
							{user.followers?.length || 0}
						</p>
						<p className='text-sm text-muted-foreground'>
							Followers
						</p>
					</div>
					<div>
						<p className='font-bold'>
							{user.following?.length || 0}
						</p>
						<p className='text-sm text-muted-foreground'>
							Following
						</p>
					</div>
				</div>
			</div>

			<Tabs defaultValue='posts'>
				<TabsList className='w-full'>
					<TabsTrigger className='flex-1' value='posts'>
						Posts
					</TabsTrigger>
					<TabsTrigger className='flex-1' value='followers'>
						Followers
					</TabsTrigger>
				</TabsList>
				<TabsContent value='posts'>
					<Suspense fallback={<ProfileSkeleton />}>
						<ProfilePosts username={user.username} />
					</Suspense>
				</TabsContent>
				<TabsContent value='followers'>
					<ProfileFollowers username={user.username} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
