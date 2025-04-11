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
import { AdminStoriesList } from "@/components/admin/admin-stories-list";
import { Search } from "lucide-react";

export default function StoriesPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Story Management
				</h1>
				<p className='text-muted-foreground'>
					Manage and moderate stories across the platform
				</p>
			</div>

			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search stories...'
						className='pl-8'
					/>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>Export</Button>
					<Button>Bulk Actions</Button>
				</div>
			</div>

			<Tabs defaultValue='active'>
				<TabsList>
					<TabsTrigger value='active'>Active Stories</TabsTrigger>
					<TabsTrigger value='flagged'>Flagged</TabsTrigger>
					<TabsTrigger value='expired'>Expired</TabsTrigger>
					<TabsTrigger value='trending'>Trending</TabsTrigger>
				</TabsList>
				<TabsContent value='active' className='mt-6'>
					<AdminStoriesList />
				</TabsContent>
				<TabsContent value='flagged' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Flagged Stories</CardTitle>
							<CardDescription>
								Stories that require review
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminStoriesList filterStatus='flagged' />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='expired' className='mt-6'>
					<AdminStoriesList filterStatus='expired' />
				</TabsContent>
				<TabsContent value='trending' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Trending Stories</CardTitle>
							<CardDescription>
								Most viewed stories in the last 24 hours
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminStoriesList filterTrending={true} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
