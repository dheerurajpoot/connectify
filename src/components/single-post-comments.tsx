"use client";

import { useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Heart } from "lucide-react";

interface Comment {
	_id: string;
	userId: {
		name: string;
		username: string;
		avatar: string;
		isVerified: boolean;
	};
	content: string;
	timePosted: string;
	likes: number;
}

interface SinglePostCommentsProps {
	comments: Comment[];
}

export default function SinglePostComments({
	comments,
}: SinglePostCommentsProps) {
	const [likedComments, setLikedComments] = useState<Record<string, boolean>>(
		{}
	);
	const [commentLikes, setCommentLikes] = useState<Record<string, number>>(
		comments.reduce((acc, comment) => {
			acc[comment._id] = comment.likes;
			return acc;
		}, {} as Record<string, number>)
	);

	const handleLikeComment = (commentId: string) => {
		setLikedComments((prev) => {
			const wasLiked = prev[commentId];
			return { ...prev, [commentId]: !wasLiked };
		});

		setCommentLikes((prev) => {
			const currentLikes = prev[commentId] || 0;
			return {
				...prev,
				[commentId]: likedComments[commentId]
					? currentLikes - 1
					: currentLikes + 1,
			};
		});
	};

	return (
		<div className='space-y-4 p-4'>
			{comments.length === 0 ? (
				<p className='py-8 text-center text-muted-foreground'>
					No comments yet. Be the first to comment!
				</p>
			) : (
				comments.map((comment) => (
					<div key={comment._id} className='flex gap-3'>
						<Link href={`/profile/${comment?.userId?.username}`}>
							<Avatar className='h-8 w-8 border border-primary/10'>
								<AvatarImage
									src={comment?.userId?.avatar}
									alt={comment?.userId?.name}
									className='object-cover'
								/>
								<AvatarFallback>
									{comment?.userId?.name.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
						</Link>
						<div className='flex-1'>
							<div className='flex flex-wrap items-start flex-col gap-x-1'>
								<Link
									href={`/profile/${comment?.userId?.username}`}
									className='font-semibold hover:underline flex items-center gap-1'>
									{comment?.userId?.name}
									{comment?.userId?.isVerified && (
										<BadgeCheck className='h-4 w-4 text-blue-500' />
									)}
								</Link>
								<p className='text-sm'>{comment.content}</p>
							</div>
							<div className='mt-1 flex items-center gap-3 text-xs text-muted-foreground'>
								<span>{comment.timePosted}</span>
								<span className='cursor-pointer hover:text-primary'>
									Reply
								</span>
								<span className='cursor-pointer hover:text-primary'>
									Report
								</span>
							</div>
						</div>
						<div className='flex flex-col items-center'>
							<Button
								variant='ghost'
								size='icon'
								className='h-8 w-8 rounded-full'
								onClick={() => handleLikeComment(comment._id)}>
								<Heart
									className={`h-4 w-4 ${
										likedComments[comment._id]
											? "fill-red-500 text-red-500"
											: ""
									}`}
								/>
							</Button>
							{commentLikes[comment._id] > 0 && (
								<span className='text-xs font-medium'>
									{commentLikes[comment._id]}
								</span>
							)}
						</div>
					</div>
				))
			)}
		</div>
	);
}
