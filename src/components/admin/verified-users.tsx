"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BadgeCheck, MoreHorizontal } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type VerifiedUser = {
	id: string;
	name: string;
	username: string;
	avatar: string;
	category: "creator" | "business" | "public_figure" | "other";
	followers: number;
	verifiedSince: string;
};

export function VerifiedUsers() {
	const [users, setUsers] = useState<VerifiedUser[]>([
		{
			id: "1",
			name: "Alex Johnson",
			username: "alexj",
			avatar: "/placeholder.svg?height=40&width=40",
			category: "creator",
			followers: 142500,
			verifiedSince: "2023-01-15",
		},
		{
			id: "3",
			name: "Michael Chen",
			username: "michael",
			avatar: "/placeholder.svg?height=40&width=40",
			category: "public_figure",
			followers: 89300,
			verifiedSince: "2023-03-10",
		},
		{
			id: "9",
			name: "Tech Innovations",
			username: "techinnovate",
			avatar: "/placeholder.svg?height=40&width=40",
			category: "business",
			followers: 65800,
			verifiedSince: "2023-05-22",
		},
	]);

	const removeVerification = (userId: string) => {
		setUsers(users.filter((user) => user.id !== userId));
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Verified Users</CardTitle>
				<CardDescription>
					Manage users with verified status
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{users.length === 0 ? (
						<p className='text-center text-sm text-muted-foreground'>
							No verified users found
						</p>
					) : (
						<div className='grid gap-4'>
							{users.map((user) => (
								<div
									key={user.id}
									className='flex items-center justify-between rounded-lg border p-4'>
									<div className='flex items-center gap-3'>
										<Avatar>
											<AvatarImage
												src={user.avatar}
												alt={user.name}
											/>
											<AvatarFallback>
												{user.name.slice(0, 2)}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className='flex items-center gap-1'>
												<span className='font-medium'>
													{user.name}
												</span>
												<BadgeCheck className='h-5 w-5 text-white fill-blue-500' />
											</div>
											<div className='text-sm text-muted-foreground'>
												@{user.username}
											</div>
											<div className='mt-1 flex items-center gap-2'>
												<Badge
													variant='outline'
													className='capitalize'>
													{user.category.replace(
														"_",
														" "
													)}
												</Badge>
												<span className='text-xs text-muted-foreground'>
													{user.followers.toLocaleString()}{" "}
													followers
												</span>
											</div>
										</div>
									</div>
									<div className='flex items-center gap-2'>
										<div className='text-sm text-muted-foreground'>
											Verified since{" "}
											{new Date(
												user.verifiedSince
											).toLocaleDateString()}
										</div>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													size='icon'>
													<MoreHorizontal className='h-4 w-4' />
													<span className='sr-only'>
														Actions
													</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end'>
												<DropdownMenuLabel>
													Actions
												</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													onClick={() =>
														(window.location.href = `/profile/${user.username}`)
													}>
													View Profile
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														removeVerification(
															user.id
														)
													}>
													Remove Verification
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
