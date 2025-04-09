"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getConversations } from "@/app/actions/message-actions";
import { useSession } from "next-auth/react";
import { useToast } from "../../hooks/use-toast";
interface Conversation {
	partner: {
		_id: string;
		name: string;
		username: string;
		avatar: string;
	};
	lastMessage: {
		content: string;
		createdAt: string;
		read: boolean;
	};
}

export function MessageList() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const searchParams = useSearchParams();
	const router = useRouter();
	const selectedConversation = searchParams.get("id");
	const { toast } = useToast();
	const { data: session } = useSession();

	useEffect(() => {
		if (session?.user?.id) {
			fetchConversations();
		}
	}, [session]);

	const fetchConversations = async () => {
		setLoading(true);

		try {
			const result = await getConversations();

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			} else if (result?.success) {
				setConversations(result.conversations);
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to load conversations",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const filteredConversations = conversations.filter(
		(conversation) =>
			conversation.partner.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			conversation.partner.username
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	// Mock data for development
	const mockConversations = [
		{
			id: "1",
			name: "Emma Wilson",
			username: "emma",
			avatar: "/placeholder.svg?height=40&width=40",
			lastMessage: "That sounds great! Send me the details",
			time: "2m",
			unread: true,
		},
		{
			id: "2",
			name: "Alex Thompson",
			username: "alex",
			avatar: "/placeholder.svg?height=40&width=40",
			lastMessage: "Are we still meeting tomorrow?",
			time: "1h",
			unread: false,
		},
		{
			id: "3",
			name: "Michael Chen",
			username: "michael",
			avatar: "/placeholder.svg?height=40&width=40",
			lastMessage: "I just sent you the files you requested",
			time: "3h",
			unread: false,
		},
		{
			id: "4",
			name: "Sophie Taylor",
			username: "sophie",
			avatar: "/placeholder.svg?height=40&width=40",
			lastMessage: "Thanks for your help with the project!",
			time: "1d",
			unread: false,
		},
	];

	return (
		<div className='flex h-full flex-col'>
			<div className='border-b p-4'>
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
					<Input
						placeholder='Search messages'
						className='pl-9'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
			</div>
			<div className='flex-1 overflow-auto'>
				{loading ? (
					<div className='flex h-full items-center justify-center'>
						<p>Loading conversations...</p>
					</div>
				) : filteredConversations.length === 0 ? (
					<div className='flex h-full items-center justify-center p-4'>
						<p className='text-center text-sm text-muted-foreground'>
							{searchQuery
								? "No conversations match your search"
								: "No conversations yet"}
						</p>
					</div>
				) : (
					// Use mock data for now
					mockConversations.map((conversation) => (
						<Link
							key={conversation.id}
							href={`/messages?id=${conversation.id}`}
							className={cn(
								"flex items-center gap-3 border-b p-4 hover:bg-accent",
								selectedConversation === conversation.id &&
									"bg-accent"
							)}>
							<div className='relative'>
								<Avatar>
									<AvatarImage
										src={conversation.avatar}
										alt={conversation.name}
									/>
									<AvatarFallback>
										{conversation.name.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								{conversation.unread && (
									<div className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary' />
								)}
							</div>
							<div className='flex-1 overflow-hidden'>
								<div className='flex items-center justify-between'>
									<p
										className={cn(
											"font-medium",
											conversation.unread &&
												"font-semibold"
										)}>
										{conversation.name}
									</p>
									<p className='text-xs text-muted-foreground'>
										{conversation.time}
									</p>
								</div>
								<p
									className={cn(
										"truncate text-sm text-muted-foreground",
										conversation.unread && "text-foreground"
									)}>
									{conversation.lastMessage}
								</p>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}
