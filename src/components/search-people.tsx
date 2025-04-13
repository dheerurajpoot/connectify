"use client";

import { useState } from "react";
import { searchPeople } from "@/app/actions/user-actions";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BadgeCheck } from "lucide-react";

interface User {
	_id: string;
	name: string;
	username: string;
	avatar?: string;
	isVerified?: boolean;
}

export function SearchPeople() {
	const [query, setQuery] = useState("");
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const searchUsers = async () => {
			if (!query.trim()) {
				setUsers([]);
				return;
			}

			setIsLoading(true);
			try {
				const result = await searchPeople(query);
				if (result.success && result.users) {
					// Transform the MongoDB data to match the User interface
					const transformedUsers = result.users.map(user => ({
						_id: user._id,
						name: user.name,
						username: user.username,
						avatar: user.avatar,
						isVerified: user.isVerified ? true : false
					}));
					setUsers(transformedUsers);
				} else {
					setUsers([]);
				}
			} catch (error) {
				console.error("Error searching users:", error);
				setUsers([]);
			} finally {
				setIsLoading(false);
			}
		};

		searchUsers();
	}, [query]);

	return (
		<div className='w-full space-y-4'>
			<div className='relative'>
				<Input
					type='text'
					placeholder='Search people...'
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className='w-full'
				/>
			</div>
			{query.trim() !== "" && (
				<div className='absolute z-10 w-full max-w-md bg-background border rounded-lg shadow-lg'>
					{isLoading ? (
						<div className='p-4 text-center text-muted-foreground'>
							Loading...
						</div>
					) : users.length > 0 ? (
						<div className='py-2'>
							{users.map((user) => (
								<Link
									key={user._id}
									href={`/profile/${user.username}`}
									className='flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors'>
									{/* <UserAvatar user={user} />  */}
									<Avatar className='border-2 border-primary/10'>
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
										<p className='font-medium'>
											{user.name}
											{user.isVerified && (
												<BadgeCheck className='h-4 w-4 text-blue-500' />
											)}
										</p>
										<p className='text-sm text-muted-foreground'>
											@{user.username}
										</p>
									</div>
								</Link>
							))}
						</div>
					) : query.trim() !== "" ? (
						<div className='p-4 text-center text-muted-foreground'>
							No users found
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}
