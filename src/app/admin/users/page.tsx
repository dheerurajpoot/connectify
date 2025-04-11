import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminUsersList } from "@/components/admin/admin-users-list";
import { Search } from "lucide-react";

export default function UsersPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					User Management
				</h1>
				<p className='text-muted-foreground'>
					Manage and monitor user accounts
				</p>
			</div>

			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search users...'
						className='pl-8'
					/>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>Export</Button>
					<Button>Add User</Button>
				</div>
			</div>

			<Tabs defaultValue='all'>
				<TabsList>
					<TabsTrigger value='all'>All Users</TabsTrigger>
					<TabsTrigger value='active'>Active</TabsTrigger>
					<TabsTrigger value='pending'>Pending</TabsTrigger>
					<TabsTrigger value='suspended'>Suspended</TabsTrigger>
					<TabsTrigger value='verified'>Verified</TabsTrigger>
				</TabsList>
				<TabsContent value='all' className='mt-6'>
					<AdminUsersList />
				</TabsContent>
				<TabsContent value='active' className='mt-6'>
					<AdminUsersList filterStatus='active' />
				</TabsContent>
				<TabsContent value='pending' className='mt-6'>
					<AdminUsersList filterStatus='pending' />
				</TabsContent>
				<TabsContent value='suspended' className='mt-6'>
					<AdminUsersList filterStatus='suspended' />
				</TabsContent>
				<TabsContent value='verified' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Verified Users</CardTitle>
							<CardDescription>
								Users with verified status
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminUsersList filterVerified={true} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
