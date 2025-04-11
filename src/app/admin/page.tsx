import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminStats } from "@/components/admin/admin-stats";
import { RecentUsers } from "@/components/admin/recent-users";
import { RecentPosts } from "@/components/admin/recent-posts";
import { VerificationRequests } from "@/components/admin/verification-requests";

export default function AdminDashboard() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
				<p className='text-muted-foreground'>
					Manage your social media platform
				</p>
			</div>

			<AdminStats />

			<Tabs defaultValue='users'>
				<TabsList className='grid w-full grid-cols-4'>
					<TabsTrigger value='users'>Recent Users</TabsTrigger>
					<TabsTrigger value='posts'>Recent Posts</TabsTrigger>
					<TabsTrigger value='reports'>Reports</TabsTrigger>
					<TabsTrigger value='verification'>Verification</TabsTrigger>
				</TabsList>
				<TabsContent value='users' className='mt-6'>
					<RecentUsers />
				</TabsContent>
				<TabsContent value='posts' className='mt-6'>
					<RecentPosts />
				</TabsContent>
				<TabsContent value='reports' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Reported Content</CardTitle>
							<CardDescription>
								Review and manage reported content
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className='text-sm text-muted-foreground'>
								No reports to review at this time.
							</p>
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='verification' className='mt-6'>
					<VerificationRequests />
				</TabsContent>
			</Tabs>
		</div>
	);
}
