import { getSuggested } from "@/app/actions/user-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FollowButton } from "@/components/follow-button";
import Link from "next/link";

export async function SuggestedUsers() {
	const { success, users } = await getSuggested();
	if (!success || !users?.length) {
		return null;
	}

	return (
		<Card>
			<CardHeader className='pb-3'>
				<CardTitle className='text-sm font-medium'>
					Suggested for you
				</CardTitle>
			</CardHeader>
			<CardContent className='grid gap-4'>
				{users.map((user) => (
					<div
						key={user._id}
						className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<Avatar className='h-8 w-8'>
								<AvatarImage
									src={user.avatar || ""}
									alt={user.name}
									className='object-cover'
								/>
								<AvatarFallback>
									{user.name.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div>
								<Link
									href={`/profile/${user.username}`}
									className='text-sm font-medium hover:underline'>
									{user.name}
								</Link>
								<p className='text-xs text-muted-foreground'>
									@{user.username}
								</p>
							</div>
						</div>
						<FollowButton
							username={user.username}
							initialIsFollowing={false}
						/>
					</div>
				))}
				<Button
					variant='ghost'
					size='sm'
					className='w-full text-xs text-muted-foreground'>
					See more
				</Button>
			</CardContent>
		</Card>
	);
}
