"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Menu, LogOut } from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

export function MobileHeader() {
	const pathname = usePathname();
	const { data: session } = useSession();
	const router = useRouter();

	const navItems = [
		{
			name: "Home",
			href: "/",
		},
		{
			name: "Explore",
			href: "/explore",
		},
		{
			name: "Messages",
			href: "/messages",
		},
		{
			name: "Profile",
			href: session?.user?.username
				? `/profile/${session.user.username}`
				: "/auth/login",
		},
		{
			name: "Create",
			href: "/create",
		},
	];

	const handleLogout = async () => {
		try {
			await signOut({ redirect: false });

			router.push("/auth/login");
			router.refresh();
		} catch (error) {
			console.log("Sign out error", error);
		}
	};

	return (
		<header className='fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden'>
			<Link href='/' className='flex items-center gap-2 font-semibold'>
				<div className='relative h-7 w-7'>
					<Image
						src='/orbtao.svg?height=32&width=32'
						alt='Orbtao Logo'
						fill
						className='rounded'
					/>
				</div>
				<span className='text-xl font-bold'>Orbtao</span>
			</Link>

			<div className='flex items-center gap-2'>
				<Link href='/notifications'>
					<Button
						variant='ghost'
						size='icon'
						className='rounded-full'>
						<Bell className='h-5 w-5' />
						<span className='sr-only'>Notifications</span>
					</Button>
				</Link>

				<Sheet>
					<SheetTitle></SheetTitle>
					<SheetDescription></SheetDescription>
					<SheetTrigger asChild>
						<Button
							variant='ghost'
							size='icon'
							className='rounded-full'>
							<Menu className='h-5 w-5' />
							<span className='sr-only'>Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side='right' className='flex flex-col p-8'>
						<div className='flex items-center gap-3 border-b pb-4'>
							<Avatar>
								<AvatarImage
									src={session?.user?.image || ""}
									alt='User'
								/>
								<AvatarFallback>
									{session?.user?.name?.charAt(0) || "U"}
								</AvatarFallback>
							</Avatar>
							<div className='flex-1'>
								<p className='text-sm font-medium'>
									{session?.user?.name}
								</p>
								<p className='text-xs text-muted-foreground'>
									@{session?.user.username}
								</p>
							</div>
						</div>

						<nav className='flex-1 py-4'>
							<div className='grid gap-1'>
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
										{item.name}
									</Link>
								))}
							</div>
						</nav>

						<div className='border-t pt-4'>
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
								<div className='flex items-center gap-2 px-2 py-1'>
									<span>Theme</span>
									<ThemeToggle />
								</div>
								<Button
									variant='ghost'
									onClick={handleLogout}
									className='flex items-center gap-2 justify-start px-2 py-1 hover:bg-accent'>
									<LogOut className='h-4 w-4' />
									Log Out
								</Button>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</header>
	);
}
