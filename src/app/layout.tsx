import type React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileNavbar } from "@/components/mobile-navbar";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "Orbtao | Connect with friends and the world",
		template: "%s | Orbtao",
	},
	description:
		"Connect with friends and the world around you on Orbtao. Share photos, videos, thoughts and more.",
	keywords: [
		"social media",
		"social network",
		"connect",
		"friends",
		"photos",
		"videos",
		"stories",
	],
	authors: [{ name: "Orbtao" }],
	creator: "Orbtao Team",
	publisher: "Orbtao Inc.",
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.orbtao.com",
		title: "Orbtao | Connect with friends and the world",
		description:
			"Connect with friends and the world around you on Orbtao. Share photos, videos, thoughts and more.",
		siteName: "Orbtao",
	},
	twitter: {
		card: "summary_large_image",
		title: "Orbtao | Connect with friends and the world",
		description:
			"Connect with friends and the world around you on Orbtao. Share photos, videos, thoughts and more.",
		creator: "@Orbtao",
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
				<link
					rel='icon'
					href='/placeholder-logo.svg'
					type='image/svg+xml'
				/>
				<link rel='apple-touch-icon' href='/placeholder-logo.svg' />
				<meta name='apple-mobile-web-app-capable' content='yes' />
				<meta name='theme-color' content='#000000' />
			</head>
			<body
				className={cn("min-h-screen", inter.className)}
				suppressHydrationWarning>
				<Providers>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						disableTransitionOnChange>
						<MobileHeader />
						<div className='flex h-full'>
							<DesktopSidebar className='hidden md:flex' />
							<main className='flex-1 pb-16 md:pb-0 md:pl-64'>
								{children}
							</main>
							<MobileNavbar className='fixed bottom-0 z-50 w-full md:hidden' />
						</div>
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}

import "./globals.css";
import { MobileHeader } from "@/components/mobile-header";
