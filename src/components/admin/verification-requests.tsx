"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type VerificationRequest = {
	id: string;
	user: {
		id: string;
		name: string;
		username: string;
		avatar: string;
		followers: number;
	};
	category: "creator" | "business" | "public_figure" | "other";
	reason: string;
	documents: string[];
	status: "pending" | "approved" | "rejected";
	submittedAt: string;
};

export function VerificationRequests() {
	const [requests, setRequests] = useState<VerificationRequest[]>([
		{
			id: "1",
			user: {
				id: "6",
				name: "Jessica Williams",
				username: "jessicaw",
				avatar: "/placeholder.svg?height=40&width=40",
				followers: 25600,
			},
			category: "creator",
			reason: "I'm a content creator with a growing audience and want to protect my identity from impersonation.",
			documents: ["id_verification.jpg", "proof_of_work.pdf"],
			status: "pending",
			submittedAt: "2023-06-10T15:30:00Z",
		},
		{
			id: "2",
			user: {
				id: "7",
				name: "David Lee",
				username: "davidlee",
				avatar: "/placeholder.svg?height=40&width=40",
				followers: 42300,
			},
			category: "public_figure",
			reason: "I'm a local politician and need to verify my account for public communications.",
			documents: ["government_id.jpg", "official_website.pdf"],
			status: "pending",
			submittedAt: "2023-06-09T11:45:00Z",
		},
		{
			id: "3",
			user: {
				id: "8",
				name: "Cafe Deluxe",
				username: "cafedeluxe",
				avatar: "/placeholder.svg?height=40&width=40",
				followers: 18900,
			},
			category: "business",
			reason: "We're a popular local business and want to verify our official account.",
			documents: ["business_license.pdf", "tax_registration.jpg"],
			status: "pending",
			submittedAt: "2023-06-08T09:20:00Z",
		},
	]);

	const updateRequestStatus = (
		requestId: string,
		status: "approved" | "rejected"
	) => {
		setRequests(
			requests.map((request) =>
				request.id === requestId ? { ...request, status } : request
			)
		);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Verification Requests</CardTitle>
				<CardDescription>
					Review and manage verification requests
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='space-y-6'>
					{requests.length === 0 ? (
						<p className='text-center text-sm text-muted-foreground'>
							No pending verification requests
						</p>
					) : (
						requests.map((request) => (
							<div
								key={request.id}
								className='rounded-lg border p-4'>
								<div className='flex flex-col gap-4 sm:flex-row sm:items-start'>
									<div className='flex items-center gap-3'>
										<Avatar className='h-12 w-12'>
											<AvatarImage
												src={request.user.avatar}
												alt={request.user.name}
											/>
											<AvatarFallback>
												{request.user.name.slice(0, 2)}
											</AvatarFallback>
										</Avatar>
										<div>
											<div className='font-medium'>
												{request.user.name}
											</div>
											<div className='text-sm text-muted-foreground'>
												@{request.user.username}
											</div>
											<div className='mt-1 text-xs text-muted-foreground'>
												{request.user.followers.toLocaleString()}{" "}
												followers
											</div>
										</div>
									</div>

									<div className='flex-1 space-y-2'>
										<div className='flex flex-wrap items-center gap-2'>
											<Badge
												variant='outline'
												className='capitalize'>
												{request.category.replace(
													"_",
													" "
												)}
											</Badge>
											<span className='text-xs text-muted-foreground'>
												Submitted{" "}
												{new Date(
													request.submittedAt
												).toLocaleDateString()}
											</span>
										</div>
										<p className='text-sm'>
											{request.reason}
										</p>
										<div className='flex flex-wrap gap-2'>
											{request.documents.map(
												(doc, index) => (
													<Badge
														key={index}
														variant='secondary'
														className='cursor-pointer'>
														{doc}
													</Badge>
												)
											)}
										</div>
									</div>

									<div className='flex flex-col gap-2'>
										<Button
											onClick={() =>
												updateRequestStatus(
													request.id,
													"approved"
												)
											}
											className='w-full sm:w-auto'
											variant='default'>
											Approve
										</Button>
										<Button
											onClick={() =>
												updateRequestStatus(
													request.id,
													"rejected"
												)
											}
											className='w-full sm:w-auto'
											variant='outline'>
											Reject
										</Button>
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
}
