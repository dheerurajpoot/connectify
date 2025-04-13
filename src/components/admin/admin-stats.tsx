"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, ImageIcon, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminDashboardStats } from "@/app/actions/admin-actions";
import { toast } from "sonner";

interface SystemStats {
	totalStats: {
		users: number;
		posts: number;
		comments: number;
		stories: number;
	};
	lastDayStats: {
		newUsers: number;
		newPosts: number;
	};
}

export function AdminStats() {
	const [stats, setStats] = useState<SystemStats | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			try {
				const response = await getAdminDashboardStats();
				if (!response.success) {
					toast.error(response.error);
					return;
				}
				if (response.success && response.stats) {
					setStats(response.stats);
				}
			} catch (error) {
				console.error("Error fetching stats:", error);
				toast.error("Failed to fetch stats");
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, []);

	if (!stats) {
		return <div>Failed to load stats</div>;
	}

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
					<div className='text-2xl font-bold'>
						{stats.totalStats.users}
					</div>
					<p className='text-xs text-muted-foreground'>
						+{stats.lastDayStats.newUsers} today
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
					<div className='text-2xl font-bold'>
						{stats.totalStats.posts}
					</div>
					<p className='text-xs text-muted-foreground'>
						+{stats.lastDayStats.newPosts} today
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Stories
					</CardTitle>
					<ImageIcon className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{stats.totalStats.stories}
					</div>
					<p className='text-xs text-muted-foreground'>
						Total stories
					</p>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
					<CardTitle className='text-sm font-medium'>
						Comments
					</CardTitle>
					<Activity className='h-4 w-4 text-muted-foreground' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold'>
						{stats.totalStats.comments}
					</div>
					<p className='text-xs text-muted-foreground'>
						Total comments
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
