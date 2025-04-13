"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { handleFollow } from "@/app/actions/profile-actions";
import { useState } from "react";
import { BadgeCheck } from "lucide-react";

interface User {
	_id: string;
	name: string;
	username: string;
	avatar?: string;
	isVerified: boolean;
}

interface ProfileFollowersProps {
	username: string;
	followers: User[];
	following: User[];
	currentUserFollowing: string[];
}

export function ProfileFollowers({
	username,
	followers,
	following,
	currentUserFollowing,
}: ProfileFollowersProps) {
	const { toast } = useToast();
	const [followingState, setFollowingState] = useState<{
		[key: string]: boolean;
	}>({
		...followers.reduce(
			(acc, user) => ({
				...acc,
				[user.username]: currentUserFollowing.includes(user._id),
			}),
			{}
		),
		...following.reduce(
			(acc, user) => ({
				...acc,
				[user.username]: currentUserFollowing.includes(user._id),
			}),
			{}
		),
	});

	const handleFollowAction = async (
		targetUsername: string,
		isFollowing: boolean
	) => {
		try {
			setFollowingState((prev) => ({
				...prev,
				[targetUsername]: !isFollowing,
			}));

			await handleFollow(targetUsername, isFollowing, new FormData());

			toast({
				title: isFollowing
					? `Unfollowed @${targetUsername}`
					: `Following @${targetUsername}`,
			});
		} catch (error) {
			// Revert the state if the API call fails
			setFollowingState((prev) => ({
				...prev,
				[targetUsername]: isFollowing,
			}));

			console.error("Follow/unfollow error:", error);
			toast({
				title: "Failed to update follow status",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className='p-1'>
			<Tabs defaultValue='followers'>
				<TabsList className='w-full'>
					<TabsTrigger value='followers' className='flex-1'>
						Followers ({followers.length})
					</TabsTrigger>
					<TabsTrigger value='following' className='flex-1'>
						Following ({following.length})
					</TabsTrigger>
				</TabsList>
				<TabsContent value='followers' className='p-3'>
					<div className='grid gap-4'>
						{followers.map((user) => (
							<div
								key={user._id}
								className='flex items-center justify-between'>
								<Link
									href={`/profile/${user.username}`}
									className='flex items-center gap-3'>
									<Avatar>
										<AvatarImage
											src={user.avatar}
											alt={user.name}
											className='object-cover'
										/>
										<AvatarFallback>
											{user.name.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-medium flex items-center gap-1'>
											{user.name}
											{user.isVerified && (
												<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
											)}
										</p>
										<p className='text-xs text-muted-foreground'>
											@{user.username}
										</p>
									</div>
								</Link>
								{user.username !== username && (
									<Button
										variant={
											followingState[user.username]
												? "outline"
												: "default"
										}
										size='sm'
										onClick={() =>
											handleFollowAction(
												user.username,
												followingState[user.username]
											)
										}>
										{followingState[user.username]
											? "Following"
											: "Follow"}
									</Button>
								)}
							</div>
						))}
					</div>
				</TabsContent>
				<TabsContent value='following' className='p-3'>
					<div className='grid gap-4'>
						{following.map((user) => (
							<div
								key={user._id}
								className='flex items-center justify-between'>
								<Link
									href={`/profile/${user.username}`}
									className='flex items-center gap-3'>
									<Avatar>
										<AvatarImage
											src={user.avatar}
											alt={user.name}
											className='object-cover'
										/>
										<AvatarFallback>
											{user.name.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className='font-medium flex items-center gap-1'>
											{user.name}
											{user.isVerified && (
												<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
											)}
										</p>
										<p className='text-xs text-muted-foreground'>
											@{user.username}
										</p>
									</div>
								</Link>
								{user.username !== username && (
									<Button
										variant={
											followingState[user.username]
												? "outline"
												: "default"
										}
										size='sm'
										onClick={() =>
											handleFollowAction(
												user.username,
												followingState[user.username]
											)
										}>
										{followingState[user.username]
											? "Following"
											: "Follow"}
									</Button>
								)}
							</div>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</Card>
	);
}
