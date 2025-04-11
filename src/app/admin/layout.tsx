import type React from "react";
import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const metadata: Metadata = {
	title: "Admin Dashboard | Connectify",
	description: "Manage your social media platform",
};

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex min-h-screen flex-col md:flex-row'>
			<AdminSidebar className='w-full md:w-64 md:flex-shrink-0' />
			<div className='flex-1 overflow-auto p-6 md:p-8'>{children}</div>
		</div>
	);
}
