"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createAdminNotification } from "@/app/actions/admin-actions";
import { useRouter } from "next/navigation";

export function AdminCreateNotification() {
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!message.trim()) {
			toast.error("Please enter a message");
			return;
		}

		setLoading(true);
		try {
			const response = await createAdminNotification(message);
			if (response.error) {
				throw new Error(response.error);
			}
			toast.success(response.message || "Notification sent successfully");
			setMessage("");
			router.refresh();
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to send notification");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={handleSubmit} className='space-y-6'>
			<div className='space-y-2'>
				<Label htmlFor='message'>Message</Label>
				<Textarea
					id='message'
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder='Enter your notification message'
					rows={4}
					required
				/>
			</div>

			<div className='flex gap-2'>
				<Button type='button' variant='outline' onClick={() => setMessage("")}>Clear</Button>
				<Button type='submit' disabled={loading}>
					{loading ? "Sending..." : "Send Notification"}
				</Button>
			</div>
		</form>
	);
}
