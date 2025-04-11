"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface MessageButtonProps {
	userId: string;
	username: string;
}

export function MessageButton({ userId, username }: MessageButtonProps) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/messages?id=${userId}`);
	};

	return (
		<Button
			onClick={handleClick}
			variant='secondary'
			className='gap-2 cursor-pointer'>
			<MessageCircle className='h-4 w-4' />
			Message
		</Button>
	);
}
