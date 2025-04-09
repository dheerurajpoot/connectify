import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileNavbar } from "@/components/mobile-navbar";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Connectify | Connect with friends and the world",
		template: "%s | Connectify",
	},
	description:
		"Connect with friends and the world around you on Connectify. Share photos, videos, thoughts and more.",
	keywords: [
		"social media",
		"social network",
		"connect",
		"friends",
		"photos",
		"videos",
		"stories",
	],
	authors: [{ name: "Connectify" }],
	creator: "Connectify Team",
	publisher: "Connectify Inc.",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://connectify.app",
		title: "Connectify | Connect with friends and the world",
		description:
			"Connect with friends and the world around you on Connectify. Share photos, videos, thoughts and more.",
		siteName: "Connectify",
	},
	twitter: {
		card: "summary_large_image",
		title: "Connectify | Connect with friends and the world",
		description:
			"Connect with friends and the world around you on Connectify. Share photos, videos, thoughts and more.",
		creator: "@connectify",
	},
	generator: "v0.dev",
};

export const viewport: Viewport = {
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#111827" },
	],
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<link rel='manifest' href='/manifest.json' />
				<link rel='apple-touch-icon' href='/icon-192x192.png' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
			</head>
			<body
				className={cn("min-h-screen", inter.className)}
				suppressHydrationWarning>
				<ThemeProvider
					attribute='class'
					defaultTheme='system'
					enableSystem
					disableTransitionOnChange>
					<div className='flex h-full'>
						<DesktopSidebar className='hidden md:flex' />
						<main className='flex-1 pb-16 md:pb-0 md:pl-64'>
							{children}
						</main>
						<MobileNavbar className='fixed bottom-0 z-50 w-full md:hidden' />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}

import "./globals.css";
