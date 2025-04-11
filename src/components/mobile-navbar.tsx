"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
	Home,
	Search,
	Bell,
	MessageSquare,
	User,
	PlusSquare,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface MobileNavbarProps {
	className?: string;
}

export function MobileNavbar({ className }: MobileNavbarProps) {
	const pathname = usePathname();
	const { data: session } = useSession();

	const navItems = [
		{
			href: "/",
			icon: Home,
			label: "Home",
		},
		{
			href: "/explore",
			icon: Search,
			label: "Explore",
		},
		{
			href: "/create",
			icon: PlusSquare,
			label: "Create Post",
		},
		{
			href: "/messages",
			icon: MessageSquare,
			label: "Messages",
		},
		{
			href: session?.user?.username
				? `/profile/${session.user.username}`
				: "/auth/login",
			icon: User,
			label: "Profile",
		},
	];
	return (
		<div className={cn("bg-background border-t", className)}>
			<div className='grid h-16 grid-cols-5'>
				{navItems.map((item) => (
					<Link
						key={item.href}
						href={item.href}
						className={cn(
							"flex flex-col items-center justify-center",
							pathname === item.href
								? "text-primary"
								: "text-muted-foreground"
						)}>
						<item.icon className='h-5 w-5' />
						<span className='text-xs'>{item.label}</span>
					</Link>
				))}
			</div>
		</div>
	);
}
