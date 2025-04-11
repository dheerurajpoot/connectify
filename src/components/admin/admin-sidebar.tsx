"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutDashboard,
	Users,
	FileText,
	ImageIcon,
	Bell,
	Settings,
	Shield,
	BadgeCheck,
	LogOut,
} from "lucide-react";

interface AdminSidebarProps {
	className?: string;
}

export function AdminSidebar({ className }: AdminSidebarProps) {
	const pathname = usePathname();

	const routes = [
		{
			name: "Dashboard",
			href: "/admin",
			icon: LayoutDashboard,
		},
		{
			name: "Users",
			href: "/admin/users",
			icon: Users,
		},
		{
			name: "Posts",
			href: "/admin/posts",
			icon: FileText,
		},
		{
			name: "Stories",
			href: "/admin/stories",
			icon: ImageIcon,
		},
		{
			name: "Notifications",
			href: "/admin/notifications",
			icon: Bell,
		},
		{
			name: "Verification",
			href: "/admin/verification",
			icon: BadgeCheck,
		},
		{
			name: "Reports",
			href: "/admin/reports",
			icon: Shield,
		},
		{
			name: "Settings",
			href: "/admin/settings",
			icon: Settings,
		},
	];

	return (
		<div className={cn("border-r bg-gray-50 dark:bg-gray-900", className)}>
			<div className='flex h-16 items-center border-b px-6'>
				<Link
					href='/admin'
					className='flex items-center gap-2 font-semibold'>
					<Shield className='h-6 w-6 text-primary' />
					<span>Orbtao Admin</span>
				</Link>
			</div>
			<div className='flex flex-col gap-2 p-4'>
				{routes.map((route) => (
					<Link
						key={route.href}
						href={route.href}
						className={cn(
							"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
							pathname === route.href
								? "bg-primary text-primary-foreground"
								: "text-muted-foreground hover:bg-muted hover:text-foreground"
						)}>
						<route.icon className='h-5 w-5' />
						{route.name}
					</Link>
				))}
				<div className='mt-auto pt-4'>
					<Link
						href='/'
						className='flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground'>
						<LogOut className='h-5 w-5' />
						Back to App
					</Link>
				</div>
			</div>
		</div>
	);
}
