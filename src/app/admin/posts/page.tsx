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
import { AdminPostsList } from "@/components/admin/admin-posts-list";
import { Search } from "lucide-react";

export default function PostsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Post Management
				</h1>
				<p className='text-muted-foreground'>
					Manage and moderate content across the platform
				</p>
			</div>

			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search posts...'
						className='pl-8'
					/>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>Export</Button>
					<Button>Bulk Actions</Button>
				</div>
			</div>

			<Tabs defaultValue='all'>
				<TabsList>
					<TabsTrigger value='all'>All Posts</TabsTrigger>
					<TabsTrigger value='active'>Active</TabsTrigger>
					<TabsTrigger value='flagged'>Flagged</TabsTrigger>
					<TabsTrigger value='hidden'>Hidden</TabsTrigger>
					<TabsTrigger value='trending'>Trending</TabsTrigger>
				</TabsList>
				<TabsContent value='all' className='mt-6'>
					<AdminPostsList />
				</TabsContent>
				<TabsContent value='active' className='mt-6'>
					<AdminPostsList filterStatus='active' />
				</TabsContent>
				<TabsContent value='flagged' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Flagged Posts</CardTitle>
							<CardDescription>
								Posts that require review
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminPostsList filterStatus='flagged' />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='hidden' className='mt-6'>
					<AdminPostsList filterStatus='hidden' />
				</TabsContent>
				<TabsContent value='trending' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Trending Posts</CardTitle>
							<CardDescription>
								Most popular content in the last 24 hours
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminPostsList filterTrending={true} />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
