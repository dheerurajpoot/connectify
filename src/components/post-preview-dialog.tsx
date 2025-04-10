"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "timeago.js";
import { sharePost } from "@/app/actions/post-actions";
import { toast } from "@/components/ui/use-toast";

interface PostPreviewDialogProps {
	post: {
		_id: string;
		userId: {
			_id: string;
			name: string;
			username: string;
			avatar: string;
		};
		content: string;
		media: string[];
		createdAt: string;
	};
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onShareSuccess: () => void;
}

export function PostPreviewDialog({
	post,
	open,
	onOpenChange,
	onShareSuccess,
}: PostPreviewDialogProps) {
	const [isSharing, setIsSharing] = useState(false);

	const handleShare = async () => {
		try {
			setIsSharing(true);
			const result = await sharePost(post._id);
			if (result.success) {
				toast({
					title: "Post shared successfully",
					description: "Your post has been shared to your profile",
				});
				onShareSuccess();
				onOpenChange(false);
			} else {
				toast({
					title: "Failed to share post",
					description: result.error,
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Error sharing post:", error);
			toast({
				title: "Error",
				description: "Failed to share post. Please try again.",
				variant: "destructive",
			});
		} finally {
			setIsSharing(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Share Post</DialogTitle>
				</DialogHeader>
				<div className='space-y-4'>
					{/* Post Header */}
					<div className='flex items-center gap-3'>
						<Avatar className='border-2 border-primary/10'>
							<AvatarImage
								src={post.userId.avatar}
								alt={post.userId.name}
							/>
							<AvatarFallback>
								{post.userId.name.slice(0, 2)}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className='font-semibold'>
								{post.userId.name}
							</div>
							<p className='text-xs text-muted-foreground'>
								{format(post.createdAt)}
							</p>
						</div>
					</div>

					{/* Post Content */}
					{post.content && (
						<p className='whitespace-pre-line text-sm'>
							{post.content}
						</p>
					)}

					{/* Post Media */}
					{post.media.length > 0 && (
						<div className='relative aspect-square w-full overflow-hidden rounded-lg'>
							<Image
								src={post.media[0]}
								alt={post.content || "Post image"}
								fill
								className='object-cover'
							/>
						</div>
					)}

					{/* Share Button */}
					<Button
						onClick={handleShare}
						disabled={isSharing}
						className='w-full'>
						{isSharing ? "Sharing..." : "Share Post"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
