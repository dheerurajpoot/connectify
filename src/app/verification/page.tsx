"use client";

import { BadgeCheck, Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
	submitVerificationRequest,
	getMyVerificationStatus,
} from "@/app/actions/user-actions";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function VerificationPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [links, setLinks] = useState(["", "", ""]);
	const [about, setAbout] = useState("");
	const [category, setCategory] = useState("");
	const [governmentId, setGovernmentId] = useState<File | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [isVerified, setIsVerified] = useState(false);

	useEffect(() => {
		async function checkStatus() {
			const result = await getMyVerificationStatus();
			if (result.success) {
				setStatus(result.status);
				setIsVerified(result.isVerified ?? false);
			}
		}
		checkStatus();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Validate form
		const validLinks = links.filter((link) => link.trim() !== "");
		if (validLinks.length < 3) {
			toast.error("Please provide all three links");
			setIsSubmitting(false);
			return;
		}

		if (!about.trim()) {
			toast.error("Please provide information about yourself");
			setIsSubmitting(false);
			return;
		}

		if (!category) {
			toast.error("Please select a category");
			setIsSubmitting(false);
			return;
		}

		if (!governmentId) {
			toast.error("Please upload a government ID");
			setIsSubmitting(false);
			return;
		}

		try {
			const result = await submitVerificationRequest({
				links: validLinks,
				about,
				category,
				governmentId,
			});

			if (result.success) {
				toast.success("Verification request submitted successfully");
				setStatus("pending");
			} else {
				toast.error(result.error || "Something went wrong");
			}
		} catch (error) {
			toast.error("Failed to submit verification request");
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isVerified) {
		return (
			<div className='container max-w-4xl py-8'>
				<Card>
					<CardContent className='p-6 text-center'>
						<BadgeCheck className='w-12 h-12 mx-auto text-blue-500 mb-4' />
						<h2 className='text-2xl font-bold mb-2'>
							Account Verified
						</h2>
						<p className='text-gray-600'>
							Your account has already been verified.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className='container max-w-4xl py-8 mx-8'>
			<Card>
				<CardContent className='p-6'>
					<h2 className='text-2xl font-bold mb-6'>
						Request Verification
					</h2>
					{status === "pending" ? (
						<div className='text-center'>
							<BadgeCheck className='w-12 h-12 mx-auto text-yellow-500 mb-4' />
							<h3 className='text-xl font-semibold mb-2'>
								Verification In Progress
							</h3>
							<p className='text-gray-600'>
								Your verification request is being reviewed.
								We'll notify you once it's processed.
							</p>
						</div>
					) : (
						<form onSubmit={handleSubmit} className='space-y-6'>
							<div className='space-y-2'>
								<Label htmlFor='category'>
									Account Category
								</Label>
								<RadioGroup
									defaultValue='creator'
									value={category}
									onValueChange={setCategory}
									className='grid grid-cols-2 gap-4'>
									<div>
										<RadioGroupItem
											value='creator'
											id='creator'
											className='peer sr-only'
										/>
										<Label
											htmlFor='creator'
											className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
											<span className='font-medium'>
												Creator
											</span>
											<span className='text-xs text-muted-foreground'>
												Influencer, content creator
											</span>
										</Label>
									</div>
									<div>
										<RadioGroupItem
											value='business'
											id='business'
											className='peer sr-only'
										/>
										<Label
											htmlFor='business'
											className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
											<span className='font-medium'>
												Business
											</span>
											<span className='text-xs text-muted-foreground'>
												Brand, organization
											</span>
										</Label>
									</div>
									<div>
										<RadioGroupItem
											value='public_figure'
											id='public_figure'
											className='peer sr-only'
										/>
										<Label
											htmlFor='public_figure'
											className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
											<span className='font-medium'>
												Public Figure
											</span>
											<span className='text-xs text-muted-foreground'>
												Politician, journalist
											</span>
										</Label>
									</div>
									<div>
										<RadioGroupItem
											value='other'
											id='other'
											className='peer sr-only'
										/>
										<Label
											htmlFor='other'
											className='flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'>
											<span className='font-medium'>
												Other
											</span>
											<span className='text-xs text-muted-foreground'>
												Other notable account
											</span>
										</Label>
									</div>
								</RadioGroup>
							</div>
							<div className='space-y-4'>
								<h3 className='text-lg font-semibold'>
									Social Media Links
								</h3>
								<p className='text-sm text-gray-600 mb-4'>
									Please provide links to your social media
									profiles or websites that can help verify
									your identity.
								</p>
								{links.map((link, index) => (
									<Input
										key={index}
										type='url'
										placeholder={`Link ${index + 1}`}
										value={link}
										onChange={(e) => {
											const newLinks = [...links];
											newLinks[index] = e.target.value;
											setLinks(newLinks);
										}}
									/>
								))}
							</div>

							<div className='space-y-4'>
								<h3 className='text-lg font-semibold'>
									About You
								</h3>
								<textarea
									className='w-full min-h-[100px] p-3 border rounded-md'
									placeholder="Tell us about yourself and why you're requesting verification..."
									value={about}
									onChange={(e) => setAbout(e.target.value)}
								/>
							</div>

							<div className='space-y-2'>
								<Label>Upload identification documents</Label>
								<div className='rounded-lg border border-dashed p-6'>
									<div className='flex flex-col items-center gap-2 text-center'>
										<Upload className='h-8 w-8 text-muted-foreground' />
										<div>
											<p className='font-medium'>
												Click to upload or drag and drop
											</p>
											<p className='text-xs text-muted-foreground'>
												ID card, passport, or business
												documents (JPG, PNG)
											</p>
										</div>
										<Input
											type='file'
											className='hidden'
											id='file-upload'
											accept='.jpg,.jpeg,.png'
											onChange={(e) => {
												const file = e.target.files?.[0];
												if (file) {
													setGovernmentId(file);
												}
											}}
										/>
										<div className='flex flex-col gap-2 items-center'>
											<Button
												type='button'
												variant='outline'
												onClick={() =>
													document
														.getElementById(
															"file-upload"
														)
														?.click()
												}>
												Select File
											</Button>
											{governmentId && (
												<p className='text-sm text-muted-foreground'>
													Selected: {governmentId.name}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							<Button
								type='submit'
								className='w-full'
								disabled={isSubmitting}>
								{isSubmitting ? "Submitting..." : "Submit Request"}
							</Button>
						</form>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
