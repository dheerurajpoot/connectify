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
import { AdminNotificationsList } from "@/components/admin/admin-notifications-list";
import { AdminCreateNotification } from "@/components/admin/admin-create-notification";
import { Search } from "lucide-react";

export default function NotificationsPage() {
	return (
		<div className='space-y-6'>
			<div>
				<h1 className='text-3xl font-bold tracking-tight'>
					Notification Management
				</h1>
				<p className='text-muted-foreground'>
					Manage system notifications and send announcements
				</p>
			</div>

			<Tabs defaultValue='sent'>
				<TabsList>
					<TabsTrigger value='sent'>Sent Notifications</TabsTrigger>
					<TabsTrigger value='scheduled'>Scheduled</TabsTrigger>
					<TabsTrigger value='create'>Create New</TabsTrigger>
					<TabsTrigger value='templates'>Templates</TabsTrigger>
				</TabsList>
				<TabsContent value='sent' className='mt-6'>
					<div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6'>
						<div className='relative w-full max-w-sm'>
							<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
							<Input
								type='search'
								placeholder='Search notifications...'
								className='pl-8'
							/>
						</div>
						<div className='flex gap-2'>
							<Button variant='outline'>Export</Button>
						</div>
					</div>
					<AdminNotificationsList />
				</TabsContent>
				<TabsContent value='scheduled' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Scheduled Notifications</CardTitle>
							<CardDescription>
								Notifications scheduled to be sent in the future
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminNotificationsList filterStatus='scheduled' />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='create' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Create Notification</CardTitle>
							<CardDescription>
								Send a new notification to users
							</CardDescription>
						</CardHeader>
						<CardContent>
							<AdminCreateNotification />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value='templates' className='mt-6'>
					<Card>
						<CardHeader>
							<CardTitle>Notification Templates</CardTitle>
							<CardDescription>
								Manage reusable notification templates
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								{[
									"Welcome",
									"Feature Update",
									"Announcement",
									"Security Alert",
									"Event Reminder",
									"Custom",
								].map((template) => (
									<Card
										key={template}
										className='cursor-pointer hover:bg-accent/50'>
										<CardHeader className='pb-2'>
											<CardTitle className='text-base'>
												{template}
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className='text-xs text-muted-foreground'>
												{template === "Welcome"
													? "Welcome new users to the platform"
													: template ===
													  "Feature Update"
													? "Announce new features and updates"
													: template ===
													  "Announcement"
													? "General platform announcements"
													: template ===
													  "Security Alert"
													? "Important security information"
													: template ===
													  "Event Reminder"
													? "Remind users about upcoming events"
													: "Custom notification template"}
											</p>
										</CardContent>
									</Card>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
