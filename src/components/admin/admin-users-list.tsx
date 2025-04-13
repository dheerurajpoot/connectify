"use client";

import { useEffect, useState } from "react";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BadgeCheck, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import {
	getAdminUsers,
	handleUserVerification,
	handleUserRole,
	handleUserDeletion,
	updateUser,
} from "@/app/actions/admin-actions";

type User = {
	_id: string;
	name: string;
	username: string;
	email: string;
	avatar?: string;
	bio?: string;
	location?: string;
	website?: string;
	isVerified: boolean;
	createdAt: string;
	role: "user" | "admin";
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
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [editForm, setEditForm] = useState({
		name: "",
		username: "",
		email: "",
		bio: "",
		location: "",
		website: "",
	});

	useEffect(() => {
		async function fetchUsers() {
			try {
				const response = await getAdminUsers();
				if (!response.success) {
					toast.error(response.error);
					return;
				}
				setUsers(response.users);
			} catch (error) {
				console.error("Error fetching users:", error);
				toast.error("Failed to fetch users");
			} finally {
				setLoading(false);
			}
		}

		fetchUsers();
	}, []);

	// Filter users based on props
	const filteredUsers = users.filter((user) => {
		if (filterStatus && user.status !== filterStatus) return false;
		if (filterVerified !== undefined && user.isVerified !== filterVerified)
			return false;
		return true;
	});

	const toggleVerification = async (userId: string) => {
		try {
			const response = await handleUserVerification(userId);
			if (!response.success) {
				toast.error(response.error);
				return;
			}
			toast.success(response.message);
			setUsers(
				users.map((user) =>
					user._id === userId
						? { ...user, isVerified: !user.isVerified }
						: user
				)
			);
		} catch (error) {
			console.error("Error toggling verification:", error);
			toast.error("Failed to update user verification");
		}
	};

	const updateRole = async (userId: string, role: "user" | "admin") => {
		try {
			const response = await handleUserRole(userId, role);
			if (!response.success) {
				toast.error(response.error);
				return;
			}
			toast.success(response.message);
			setUsers(
				users.map((user) =>
					user._id === userId ? { ...user, role } : user
				)
			);
		} catch (error) {
			console.error("Error updating role:", error);
			toast.error("Failed to update user role");
		}
	};

	const handleEditUser = (user: User) => {
		setEditingUser(user);
		setEditForm({
			name: user.name,
			username: user.username,
			email: user.email,
			bio: user.bio || "",
			location: user.location || "",
			website: user.website || "",
		});
		setIsEditDialogOpen(true);
	};

	const handleUpdateUser = async () => {
		if (!editingUser) return;

		try {
			const response = await updateUser(editingUser._id, editForm);
			if (!response.success) {
				toast.error(response.error);
				return;
			}

			toast.success("User updated successfully");
			setUsers(users.map(user => 
				user._id === editingUser._id ? { ...user, ...editForm } : user
			));
			setIsEditDialogOpen(false);
		} catch (error) {
			console.error("Error updating user:", error);
			toast.error("Failed to update user");
		}
	};

	const deleteUser = async (userId: string) => {
		try {
			const response = await handleUserDeletion(userId);
			if (!response.success) {
				toast.error(response.error);
				return;
			}
			toast.success(response.message);
			setUsers(users.filter((user) => user._id !== userId));
		} catch (error) {
			console.error("Error deleting user:", error);
			toast.error("Failed to delete user");
		}
	};

	if (loading) {
		return (
			<div className='flex items-center justify-center p-4'>
				<div className='h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent'></div>
			</div>
		);
	}

	// Filter users based on props
	

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
								key={user._id}
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
										user.createdAt
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
												onClick={() => toggleVerification(user._id)}>
												{user.isVerified
													? "Remove Verification"
													: "Verify User"}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => handleEditUser(user)}>
												Edit User
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												onClick={() => updateRole(user._id, "user")}>
												Set as User
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => updateRole(user._id, "admin")}>
												Set as Admin
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => deleteUser(user._id)}>
												Delete User
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))
					)}
				</div>
			</div>

			{/* Edit User Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit User Profile</DialogTitle>
						<DialogDescription>
							Make changes to the user's profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>

					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="name" className="text-right">Name</Label>
							<Input
								id="name"
								value={editForm.name}
								className="col-span-3"
								onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">Username</Label>
							<Input
								id="username"
								value={editForm.username}
								className="col-span-3"
								onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">Email</Label>
							<Input
								id="email"
								type="email"
								value={editForm.email}
								className="col-span-3"
								onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="bio" className="text-right">Bio</Label>
							<Input
								id="bio"
								value={editForm.bio}
								className="col-span-3"
								onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="location" className="text-right">Location</Label>
							<Input
								id="location"
								value={editForm.location}
								className="col-span-3"
								onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="website" className="text-right">Website</Label>
							<Input
								id="website"
								value={editForm.website}
								className="col-span-3"
								onChange={(e) => setEditForm({ ...editForm, website: e.target.value })}
							/>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
						<Button onClick={handleUpdateUser}>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
