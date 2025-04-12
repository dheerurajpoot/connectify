"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	getConversations,
	searchUsersToMessage,
} from "@/app/actions/message-actions";
import { useSession } from "next-auth/react";
import { useToast } from "../hooks/use-toast";
import { useIsMobile } from "../hooks/use-mobile";
interface Conversation {
	user: {
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
	unreadCount: number;
}

interface SearchUser {
	_id: string;
	name: string;
	username: string;
	avatar?: string;
}

export function MessageList() {
	const [conversations, setConversations] = useState<Conversation[]>([]);
	const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const searchParams = useSearchParams();
	const router = useRouter();
	const selectedConversation = searchParams.get("id");
	const { toast } = useToast();
	const { data: session } = useSession();
	const isMobile = useIsMobile();

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

	useEffect(() => {
		const searchUsers = async () => {
			if (searchQuery.length < 1) {
				setSearchResults([]);
				return;
			}

			setIsSearching(true);
			try {
				const result = await searchUsersToMessage(searchQuery);
				if (result.error) {
					toast({
						title: "Error",
						description: result.error,
						variant: "destructive",
					});
				} else if (result.success) {
					setSearchResults(result.users);
				}
			} catch (error) {
				console.error("Search error:", error);
			} finally {
				setIsSearching(false);
			}
		};

		const debounceTimeout = setTimeout(searchUsers, 300);
		return () => clearTimeout(debounceTimeout);
	}, [searchQuery]);

	const filteredConversations = conversations.filter(
		(conversation) =>
			conversation.user.name
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			conversation.user.username
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	return (
		<div
			className={cn(
				"flex h-full mt-15 flex-col message-list",
				isMobile && selectedConversation ? "hidden md:flex" : "flex"
			)}>
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
				) : searchQuery && searchResults.length > 0 ? (
					// Show search results
					searchResults.map((user) => (
						<Link
							key={user._id}
							href={`/messages?id=${user._id}`}
							className={cn(
								"flex items-center gap-3 border-b p-4 hover:bg-accent",
								selectedConversation === user._id && "bg-accent"
							)}
							onClick={(e) => {
								if (isMobile) {
									e.preventDefault();
									router.push(`/messages?id=${user._id}`);
									// Hide message list on mobile
									const messageList =
										document.querySelector(".message-list");
									if (messageList) {
										messageList.classList.add("hidden");
									}
									// Show message content on mobile
									const messageContent =
										document.querySelector(
											".message-content"
										);
									if (messageContent) {
										messageContent.classList.remove(
											"hidden"
										);
									}
								}
							}}>
							<Avatar>
								<AvatarImage
									src={user.avatar}
									alt={user.name}
								/>
								<AvatarFallback>
									{user.name.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className='flex-1'>
								<p className='font-medium'>{user.name}</p>
								<p className='text-sm text-muted-foreground'>
									@{user.username}
								</p>
							</div>
						</Link>
					))
				) : filteredConversations.length === 0 ? (
					<div className='flex h-full items-center justify-center p-4'>
						<p className='text-center text-sm text-muted-foreground'>
							{searchQuery
								? isSearching
									? "Searching..."
									: "No users found"
								: "No conversations yet"}
						</p>
					</div>
				) : (
					filteredConversations.map((conversation) => (
						<Link
							key={conversation.user._id}
							href={`/messages?id=${conversation.user._id}`}
							className={cn(
								"flex items-center gap-3 border-b p-4 hover:bg-accent",
								selectedConversation ===
									conversation.user._id && "bg-accent"
							)}
							onClick={(e) => {
								if (isMobile) {
									e.preventDefault();
									router.push(
										`/messages?id=${conversation.user._id}`
									);
									// Hide message list on mobile
									const messageList =
										document.querySelector(".message-list");
									if (messageList) {
										messageList.classList.add("hidden");
									}
									// Show message content on mobile
									const messageContent =
										document.querySelector(
											".message-content"
										);
									if (messageContent) {
										messageContent.classList.remove(
											"hidden"
										);
									}
								}
							}}>
							<div className='relative'>
								<Avatar>
									<AvatarImage
										src={conversation.user.avatar}
										alt={conversation.user.name}
									/>
									<AvatarFallback>
										{conversation.user.name.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								{conversation.unreadCount > 0 && (
									<div className='absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary' />
								)}
							</div>
							<div className='flex-1 overflow-hidden'>
								<div className='flex items-center justify-between'>
									<p
										className={cn(
											"font-medium",
											conversation.unreadCount > 0 &&
												"font-semibold"
										)}>
										{conversation.user.name}
									</p>
									<p className='text-xs text-muted-foreground'>
										{new Date(
											conversation.lastMessage.createdAt
										).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
									</p>
								</div>
								<p
									className={cn(
										"truncate text-sm text-muted-foreground",
										conversation.unreadCount > 0 &&
											"text-foreground"
									)}>
									{conversation.lastMessage.content}
								</p>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}
