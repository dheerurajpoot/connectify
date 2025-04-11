import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ImageIcon, Activity } from "lucide-react";

export function AdminStats() {
	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Total Users
					</CardTitle>
					<Users className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>12,345</div>
					<p className='text-xs text-muted-foreground'>
						+573 from last month
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Total Posts
					</CardTitle>
					<FileText className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>45,231</div>
					<p className='text-xs text-muted-foreground'>
						+2,145 from last month
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Active Stories
					</CardTitle>
					<ImageIcon className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>1,324</div>
					<p className='text-xs text-muted-foreground'>
						+346 from yesterday
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Active Users
					</CardTitle>
					<Activity className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>3,721</div>
					<p className='text-xs text-muted-foreground'>
						+15% from last hour
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
