"use client";

import { Button } from "@/components/ui/button";
import { handleFollow } from "@/app/actions/profile-actions";
import { useTransition, useState } from "react";

interface FollowButtonProps {
	username: string;
	initialIsFollowing: boolean;
}

export function FollowButton({
	username,
	initialIsFollowing,
}: FollowButtonProps) {
	const [isPending, startTransition] = useTransition();
	const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

	const handleClick = () => {
		startTransition(async () => {
			try {
				// Create a FormData object (required for server actions)
				const formData = new FormData();

				// Call the server action
				await handleFollow(username, isFollowing, formData);

				// Update local state immediately
				setIsFollowing(!isFollowing);
			} catch (error) {
				console.error("Error following/unfollowing:", error);
				// Revert the state if there was an error
				setIsFollowing(isFollowing);
			}
		});
	};

	return (
		<Button
			onClick={handleClick}
			className='cursor-pointer'
			disabled={isPending}
			variant={isFollowing ? "outline" : "default"}>
			{isPending ? "Loading..." : isFollowing ? "Following" : "Follow"}
		</Button>
	);
}
