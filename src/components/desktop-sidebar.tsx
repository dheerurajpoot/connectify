"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
	Home,
	Search,
	Bell,
	MessageSquare,
	User,
	PlusSquare,
	Menu,
	LogOut,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface DesktopSidebarProps {
	className?: string;
}

export function DesktopSidebar({ className }: DesktopSidebarProps) {
	const pathname = usePathname();
	const { data: session } = useSession();
	const router = useRouter();
	const { toast } = useToast();

	const navItems = [
		{
			name: "Home",
			href: "/",
			icon: Home,
		},
		{
			name: "Explore",
			href: "/explore",
			icon: Search,
		},
		{
			name: "Notifications",
			href: "/notifications",
			icon: Bell,
		},
		{
			name: "Messages",
			href: "/messages",
			icon: MessageSquare,
		},
		{
			name: "Profile",
			href: session?.user?.username
				? `/profile/${session.user.username}`
				: "/auth/login",
			icon: User,
		},
		{
			name: "Create",
			href: "/create",
			icon: PlusSquare,
		},
	];

	const handleLogout = async () => {
		try {
			await signOut({ redirect: false });
			toast({
				title: "Success",
				description: "Logged out successfully",
			});
			router.push("/auth/login");
			router.refresh();
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to log out",
				variant: "destructive",
			});
		}
	};

	return (
		<div
			className={cn(
				"fixed inset-y-0 z-30 flex w-64 flex-col border-r bg-background",
				className
			)}>
			<div className='flex h-16 items-center border-b px-6'>
				<Link
					href='/'
					className='flex items-center gap-2 font-semibold'>
					<div className='relative h-8 w-8'>
						<Image
							src='/placeholder.svg?height=32&width=32'
							alt='Connectify Logo'
							fill
							className='rounded'
						/>
					</div>
					<span className='text-xl'>Connectify</span>
				</Link>
			</div>
			<div className='flex-1 overflow-auto py-4'>
				<nav className='grid gap-1 px-2'>
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
								pathname === item.href
									? "bg-accent text-accent-foreground"
									: "text-muted-foreground"
							)}>
							<item.icon className='h-5 w-5' />
							{item.name}
						</Link>
					))}
				</nav>
			</div>
			<div className='border-t p-4'>
				<div className='flex items-center gap-3'>
					<Avatar>
						<AvatarImage
							src={
								session?.user?.image ||
								"/placeholder.svg?height=40&width=40"
							}
							alt='User'
						/>
						<AvatarFallback>
							{session?.user?.name?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
					<div className='flex-1'>
						<p className='text-sm font-medium'>
							{session?.user?.name || "User"}
						</p>
						<p className='text-xs text-muted-foreground'>
							@
							{session?.user?.username?.substring(0, 15) +
								"..." || "username"}
						</p>
					</div>
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant='ghost'
								size='icon'
								className='rounded-full'>
								<Menu className='h-5 w-5' />
							</Button>
						</SheetTrigger>
						<SheetContent side='left' className='px-6 py-8'>
							<SheetTitle>Menu</SheetTitle>
							<SheetDescription>
								Manage your account settings and preferences.
							</SheetDescription>
							<div className='grid gap-4 py-4'>
								<div className='grid gap-2'>
									<Link
										href='/settings'
										className='flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent'>
										Settings
									</Link>
									<Link
										href='/help'
										className='flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent'>
										Help Center
									</Link>
									<ThemeToggle />
									<Button
										variant='ghost'
										className='flex items-center gap-2 justify-start px-2 py-1 hover:bg-accent'
										onClick={handleLogout}>
										<LogOut className='h-4 w-4' />
										Log Out
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</div>
	);
}
