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
import { AdminReportsList } from "@/components/admin/admin-reports-list";
import { Search } from "lucide-react";

export default function ReportsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Report Management
				</h1>
				<p className='text-muted-foreground'>
					Review and handle user reports
				</p>
			</div>

			<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
				<div className='relative w-full max-w-sm'>
					<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						type='search'
						placeholder='Search reports...'
						className='pl-8'
					/>
				</div>
				<div className='flex gap-2'>
					<Button variant='outline'>Export</Button>
					<Button>Bulk Actions</Button>
				</div>
			</div>

			<Tabs defaultValue='pending'>
				<TabsList>
					<TabsTrigger value='pending'>Pending</TabsTrigger>
					<TabsTrigger value='resolved'>Resolved</TabsTrigger>
					<TabsTrigger value='dismissed'>Dismissed</TabsTrigger>
					<TabsTrigger value='escalated'>Escalated</TabsTrigger>
				</TabsList>
				<TabsContent value='pending' className='mt-6'>
					<AdminReportsList filterStatus='pending' />
				</TabsContent>
				<TabsContent value='resolved' className='mt-6'>
					<AdminReportsList filterStatus='resolved' />
				</TabsContent>
				<TabsContent value='dismissed' className='mt-6'>
					<AdminReportsList filterStatus='dismissed' />
				</TabsContent>
				<TabsContent value='escalated' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Escalated Reports</CardTitle>
							<CardDescription>
								Reports that require special attention
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminReportsList filterStatus='escalated' />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
