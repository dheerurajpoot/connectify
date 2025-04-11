"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BadgeCheck, MoreHorizontal } from "lucide-react";

type User = {
	id: string;
	name: string;
	username: string;
	email: string;
	avatar: string;
	isVerified: boolean;
	joinDate: string;
	status: "active" | "suspended" | "pending";
};

interface AdminUsersListProps {
	filterStatus?: "active" | "suspended" | "pending";
	filterVerified?: boolean;
}

export function AdminUsersList({
	filterStatus,
	filterVerified,
}: AdminUsersListProps) {
	const [users, setUsers] = useState<User[]>([
		{
			id: "1",
			name: "Alex Johnson",
			username: "alexj",
			email: "alex@example.com",
			avatar: "/placeholder.svg?height=40&width=40",
			isVerified: true,
			joinDate: "2023-01-15",
			status: "active",
		},
		{
			id: "2",
			name: "Emma Wilson",
			username: "emma",
			email: "emma@example.com",
			avatar: "/placeholder.svg?height=40&width=40",
			isVerified: false,
			joinDate: "2023-02-20",
			status: "active",
		},
		{
			id: "3",
			name: "Michael Chen",
			username: "michael",
			email: "michael@example.com",
			avatar: "/placeholder.svg?height=40&width=40",
			isVerified: true,
			joinDate: "2023-03-10",
			status: "active",
		},
		{
			id: "4",
			name: "Sophie Taylor",
			username: "sophie",
			email: "sophie@example.com",
			avatar: "/placeholder.svg?height=40&width=40",
			isVerified: false,
			joinDate: "2023-04-05",
			status: "pending",
		},
		{
			id: "5",
			name: "James Smith",
			username: "james",
			email: "james@example.com",
			avatar: "/placeholder.svg?height=40&width=40",
			isVerified: false,
			joinDate: "2023-05-12",
			status: "suspended",
		},
	]);

	// Filter users based on props
	const filteredUsers = users.filter((user) => {
		if (filterStatus && user.status !== filterStatus) return false;
		if (filterVerified !== undefined && user.isVerified !== filterVerified)
			return false;
		return true;
	});

	const toggleVerification = (userId: string) => {
		setUsers(
			users.map((user) =>
				user.id === userId
					? { ...user, isVerified: !user.isVerified }
					: user
			)
		);
	};

	const updateStatus = (
		userId: string,
		status: "active" | "suspended" | "pending"
	) => {
		setUsers(
			users.map((user) =>
				user.id === userId ? { ...user, status } : user
			)
		);
	};

	return (
		<div className='space-y-4'>
			<div className='rounded-md border'>
				<div className='grid grid-cols-6 bg-muted/50 p-3 text-sm font-medium'>
					<div>User</div>
					<div>Username</div>
					<div>Email</div>
					<div>Join Date</div>
					<div>Status</div>
					<div className='text-right'>Actions</div>
				</div>
				<div className='divide-y'>
					{filteredUsers.length === 0 ? (
						<div className='p-4 text-center text-sm text-muted-foreground'>
							No users found
						</div>
					) : (
						filteredUsers.map((user) => (
							<div
								key={user.id}
								className='grid grid-cols-6 items-center p-3 text-sm'>
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
									<div className='flex items-center gap-1'>
										<span className='font-medium'>
											{user.name}
										</span>
										{user.isVerified && (
											<BadgeCheck className='h-4 w-4 text-blue-500' />
										)}
									</div>
								</div>
								<div>@{user.username}</div>
								<div>{user.email}</div>
								<div>
									{new Date(
										user.joinDate
									).toLocaleDateString()}
								</div>
								<div>
									<span
										className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
											user.status === "active"
												? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
												: user.status === "suspended"
												? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
												: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
										}`}>
										{user.status.charAt(0).toUpperCase() +
											user.status.slice(1)}
									</span>
								</div>
								<div className='text-right'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant='ghost' size='icon'>
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
													toggleVerification(user.id)
												}>
												{user.isVerified
													? "Remove Verification"
													: "Verify User"}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													(window.location.href = `/admin/users/${user.id}`)
												}>
												View Details
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() =>
													updateStatus(
														user.id,
														"active"
													)
												}>
												Set as Active
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													updateStatus(
														user.id,
														"suspended"
													)
												}>
												Suspend User
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() =>
													updateStatus(
														user.id,
														"pending"
													)
												}>
												Set as Pending
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
