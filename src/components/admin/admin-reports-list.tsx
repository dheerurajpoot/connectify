"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Flag, ExternalLink } from "lucide-react";

type Report = {
	id: string;
	reporter: {
		id: string;
		name: string;
		username: string;
		avatar: string;
	};
	contentType: "post" | "comment" | "user" | "story";
	contentId: string;
	contentPreview: string;
	reason: "spam" | "harassment" | "inappropriate" | "violence" | "other";
	description: string;
	reportedAt: string;
	status: "pending" | "resolved" | "dismissed" | "escalated";
};

interface AdminReportsListProps {
	filterStatus?: "pending" | "resolved" | "dismissed" | "escalated";
}

export function AdminReportsList({ filterStatus }: AdminReportsListProps) {
	const [reports, setReports] = useState<Report[]>([
		{
			id: "1",
			reporter: {
				id: "2",
				name: "Emma Wilson",
				username: "emma",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			contentType: "post",
			contentId: "101",
			contentPreview: "This content violates community guidelines...",
			reason: "inappropriate",
			description:
				"This post contains inappropriate content that violates community guidelines.",
			reportedAt: "2023-06-15T10:30:00Z",
			status: "pending",
		},
		{
			id: "2",
			reporter: {
				id: "3",
				name: "Michael Chen",
				username: "michael",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			contentType: "user",
			contentId: "5",
			contentPreview: "User profile reported for impersonation",
			reason: "other",
			description: "This user is impersonating a public figure.",
			reportedAt: "2023-06-14T18:45:00Z",
			status: "escalated",
		},
		{
			id: "3",
			reporter: {
				id: "4",
				name: "Sophie Taylor",
				username: "sophie",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			contentType: "comment",
			contentId: "202",
			contentPreview: "This comment contains harassment...",
			reason: "harassment",
			description:
				"This user is repeatedly harassing others in the comments.",
			reportedAt: "2023-06-13T14:20:00Z",
			status: "resolved",
		},
		{
			id: "4",
			reporter: {
				id: "1",
				name: "Alex Johnson",
				username: "alexj",
				avatar: "/placeholder.svg?height=40&width=40",
			},
			contentType: "story",
			contentId: "303",
			contentPreview: "Story contains violent imagery",
			reason: "violence",
			description: "This story contains graphic violent content.",
			reportedAt: "2023-06-12T09:15:00Z",
			status: "dismissed",
		},
	]);

	// Filter reports based on props
	const filteredReports = reports.filter((report) => {
		if (filterStatus && report.status !== filterStatus) return false;
		return true;
	});

	const updateReportStatus = (
		reportId: string,
		status: "pending" | "resolved" | "dismissed" | "escalated"
	) => {
		setReports(
			reports.map((report) =>
				report.id === reportId ? { ...report, status } : report
			)
		);
	};

	return (
		<div className='space-y-4'>
			{filteredReports.length === 0 ? (
				<div className='rounded-md border p-4 text-center text-sm text-muted-foreground'>
					No reports found
				</div>
			) : (
				filteredReports.map((report) => (
					<div key={report.id} className='rounded-md border p-4'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div
									className={`rounded-full p-2 ${
										report.reason === "spam"
											? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
											: report.reason === "harassment"
											? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
											: report.reason === "inappropriate"
											? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
											: report.reason === "violence"
											? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
											: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
									}`}>
									<Flag className='h-4 w-4' />
								</div>
								<div>
									<div className='font-medium'>
										Report for{" "}
										<span className='capitalize'>
											{report.contentType === "user"
												? "User Account"
												: report.contentType}
										</span>
									</div>
									<div className='text-xs text-muted-foreground'>
										Reported:{" "}
										{new Date(
											report.reportedAt
										).toLocaleString()}
									</div>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<span
									className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
										report.status === "pending"
											? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
											: report.status === "resolved"
											? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
											: report.status === "dismissed"
											? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
											: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
									}`}>
									{report.status.charAt(0).toUpperCase() +
										report.status.slice(1)}
								</span>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' size='icon'>
											<MoreHorizontal className='h-4 w-4' />
											<span className='sr-only'>
												Actions
											</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end'>
										<DropdownMenuLabel>
											Actions
										</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuItem>
											<ExternalLink className='mr-2 h-4 w-4' />
											View Reported Content
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() =>
												updateReportStatus(
													report.id,
													"resolved"
												)
											}>
											Mark as Resolved
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateReportStatus(
													report.id,
													"dismissed"
												)
											}>
											Dismiss Report
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() =>
												updateReportStatus(
													report.id,
													"escalated"
												)
											}>
											Escalate Report
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>
						<div className='mt-3 rounded-md bg-muted p-3 text-sm'>
							{report.contentPreview}
						</div>
						<div className='mt-3 text-sm'>
							<span className='font-medium'>Reason: </span>
							<Badge
								variant='outline'
								className='ml-1 capitalize'>
								{report.reason.replace("_", " ")}
							</Badge>
						</div>
						<div className='mt-2 text-sm'>{report.description}</div>
						<div className='mt-3 flex items-center gap-2'>
							<span className='text-xs text-muted-foreground'>
								Reported by:
							</span>
							<div className='flex items-center gap-1'>
								<Avatar className='h-5 w-5'>
									<AvatarImage
										src={report.reporter.avatar}
										alt={report.reporter.name}
									/>
									<AvatarFallback>
										{report.reporter.name.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<span className='text-xs font-medium'>
									@{report.reporter.username}
								</span>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
}
