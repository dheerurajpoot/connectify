"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BadgeCheck, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VerificationPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [category, setCategory] = useState<string>("creator");
	const { toast } = useToast();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Simulate API call
		setTimeout(() => {
			setIsSubmitting(false);
			toast({
				title: "Verification request submitted",
				description:
					"We'll review your request and get back to you soon.",
			});
		}, 1500);
	};

	return (
		<div className='container max-w-2xl px-4 py-8'>
			<div className='mb-8 text-center'>
				<div className='mb-2 flex justify-center'>
					<div className='rounded-full bg-blue-100 p-3 dark:bg-blue-900/30'>
						<BadgeCheck className='h-8 w-8 text-blue-600 dark:text-blue-400' />
					</div>
				</div>
				<h1 className='text-3xl font-bold'>Request Verification</h1>
				<p className='mt-2 text-muted-foreground'>
					Get a blue verification badge to confirm that your account
					is authentic.
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Verification Application</CardTitle>
					<CardDescription>
						Please provide the following information to help us
						verify your identity.
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleSubmit}>
					<CardContent className='space-y-6'>
						<div className='space-y-2'>
							<Label htmlFor='category'>Account Category</Label>
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

						<div className='space-y-2'>
							<Label htmlFor='reason'>
								Why should this account be verified?
							</Label>
							<Textarea
								id='reason'
								placeholder='Explain why your account should receive a verification badge...'
								className='min-h-[100px]'
								required
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
											documents (PDF, JPG, PNG)
										</p>
									</div>
									<Input
										type='file'
										className='hidden'
										id='file-upload'
										multiple
										accept='.pdf,.jpg,.jpeg,.png'
									/>
									<Button
										type='button'
										variant='outline'
										onClick={() =>
											document
												.getElementById("file-upload")
												?.click()
										}>
										Select Files
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
					<CardFooter>
						<Button
							type='submit'
							className='w-full'
							disabled={isSubmitting}>
							{isSubmitting
								? "Submitting..."
								: "Submit Verification Request"}
						</Button>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
