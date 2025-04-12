"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Send,
	ImageIcon,
	Smile,
	Paperclip,
	MoreVertical,
	Loader2,
	ArrowLeft,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { getUserMessages, sendNewMessage } from "@/app/actions/message-actions";
import { Message, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useIsMobile } from "../hooks/use-mobile";

interface DBMessage {
	_id: {
		toString(): string;
	};
	senderId: {
		_id: { toString(): string };
		name: string;
		username: string;
		avatar?: string;
	};
	receiverId: {
		_id: { toString(): string };
		name: string;
		username: string;
		avatar?: string;
	};
	content: string;
	read: boolean;
	createdAt: string;
}

export function MessageContent() {
	const [messageText, setMessageText] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);
	const [partner, setPartner] = useState<User | null>(null);
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messagesContainerRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();
	const partnerId = searchParams.get("id");
	const { toast } = useToast();
	const { data: session } = useSession();
	const socketRef = useRef<Socket | null>(null);
	const [isAtBottom, setIsAtBottom] = useState(true);
	const isMobile = useIsMobile();
	const router = useRouter();

	useEffect(() => {
		if (partnerId && session?.user?.id) {
			fetchMessages();

			// Set up socket connection
			if (!socketRef.current) {
				socketRef.current = io("/", {
					path: "/api/socket/io",
					transports: ["polling"],
					reconnection: false,
					timeout: 5000,
				});

				socketRef.current.on("connect", () => {
					console.log("Connected to socket server");
					socketRef.current?.emit("join", session.user.id);
				});

				socketRef.current.on("connect_error", (error) => {
					console.log("Connection error:", error);
					toast({
						title: "Connection error",
						description: "Trying to reconnect...",
						variant: "destructive",
					});
				});

				socketRef.current.on("reconnect", (attemptNumber) => {
					console.log("Reconnected after", attemptNumber, "attempts");
					toast({
						title: "Reconnected",
						description: "Connection restored",
						variant: "default",
					});
				});

				socketRef.current.on("disconnect", (reason) => {
					console.log("Disconnected:", reason);
					if (reason === "io server disconnect") {
						// Server disconnected us, try to reconnect
						socketRef.current?.connect();
					}
				});

				socketRef.current.on("connect_error", (error) => {
					console.error("Socket connection error:", error);
				});

				socketRef.current.on("message", (message: any) => {
					if (message.senderId === partnerId) {
						const newMsg: Message = {
							...message,
							senderId: partner!,
							receiverId: {
								_id: session?.user?.id || "",
								name: session?.user?.name || "",
								username: session?.user?.username || "",
								avatar: session?.user?.image,
							},
						};
						// Add new message to the end (chronological order)
						setMessages((prev) => [...prev, newMsg]);
						scrollToBottom();
					}
				});

				socketRef.current.on("userStatus", ({ userId, online }) => {
					if (userId === partnerId) {
						setPartner((prev) =>
							prev ? { ...prev, online } : null
						);
					}
				});

				socketRef.current.on(
					"typing",
					(data: { senderId: string; isTyping: boolean }) => {
						if (data.senderId === partnerId) {
							setIsTyping(data.isTyping);
						}
					}
				);
			}
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.removeAllListeners();
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [partnerId, session]);

	const scrollToBottom = (smooth = true) => {
		if (isAtBottom) {
			messagesEndRef.current?.scrollIntoView({
				behavior: smooth ? "smooth" : "auto",
			});
		}
	};

	useEffect(() => {
		const container = messagesContainerRef.current;
		if (!container) return;

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = container;
			const isBottom =
				Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
			setIsAtBottom(isBottom);
		};

		container.addEventListener("scroll", handleScroll);
		return () => container.removeEventListener("scroll", handleScroll);
	}, []);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const fetchMessages = async () => {
		if (!partnerId) return;

		setLoading(true);

		try {
			const result = await getUserMessages(partnerId);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});
			} else if (result?.success) {
				// Messages come sorted from newest to oldest from the server
				setMessages(
					[...result.messages].reverse().map((msg: any) => ({
						_id: msg._id.toString(),
						senderId: {
							_id: msg.senderId._id.toString(),
							name: msg.senderId.name || "",
							username: msg.senderId.username || "",
							avatar: msg.senderId.avatar || undefined,
						},
						receiverId: {
							_id: msg.receiverId._id.toString(),
							name: msg.receiverId.name || "",
							username: msg.receiverId.username || "",
							avatar: msg.receiverId.avatar || undefined,
						},
						content: msg.content || "",
						read: Boolean(msg.read),
						createdAt: msg.createdAt || new Date().toISOString(),
					}))
				);

				// Get partner info from the first message
				if (result.messages.length > 0) {
					const firstMessage = result.messages[0] as any;
					const partnerInfo =
						firstMessage.senderId._id.toString() ===
						session?.user?.id
							? firstMessage.receiverId
							: firstMessage.senderId;

					setPartner({
						_id: partnerInfo._id.toString(),
						name: partnerInfo.name,
						username: partnerInfo.username,
						avatar:
							partnerInfo.avatar ||
							"/placeholder.svg?height=40&width=40",
						online: true, // TODO: Implement online status with socket.io
					});
				}
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to load messages",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSend = async () => {
		if (!messageText.trim() || !partnerId || !session?.user?.id) return;

		const socketMessage = {
			_id: Date.now().toString(),
			senderId: session.user.id,
			receiverId: partnerId,
			content: messageText,
			read: false,
			createdAt: new Date().toISOString(),
		};

		const newMessage: Partial<Message> = {
			_id: socketMessage._id,
			senderId: {
				_id: session.user.id,
				name: session.user.name || "",
				username: session.user.username || "",
				avatar: session.user.image || undefined,
			},
			receiverId: {
				_id: partnerId,
				name: partner?.name || "",
				username: partner?.username || "",
				avatar: partner?.avatar,
			},
			content: messageText,
			read: false,
			createdAt: socketMessage.createdAt,
		};

		// Optimistic update - add to end in chronological order
		setMessages((prev) => [...prev, newMessage as Message]);
		setMessageText("");

		try {
			const result = await sendNewMessage(partnerId, messageText);

			if (result?.error) {
				toast({
					title: "Error",
					description: result.error,
					variant: "destructive",
				});

				// Remove the optimistic message if there's an error
				setMessages((prev) =>
					prev.filter((msg) => msg._id !== newMessage._id)
				);
			} else {
				// Emit the message to the socket
				socketRef.current?.emit("message", socketMessage);
			}
		} catch (error) {
			toast({
				title: "Error",
				description: "Failed to send message",
				variant: "destructive",
			});

			// Remove the optimistic message if there's an error
			setMessages((prev) =>
				prev.filter((msg) => msg._id !== newMessage._id)
			);
		}
	};

	const handleTyping = (isTyping: boolean) => {
		if (partnerId && session?.user?.id) {
			socketRef.current?.emit("typing", {
				senderId: session.user.id,
				receiverId: partnerId,
				isTyping,
			});
		}
	};

	// If no conversation is selected
	if (!partnerId) {
		return (
			<div className='flex h-full items-center justify-center'>
				<div className='text-center'>
					<h3 className='text-lg font-medium'>
						Select a conversation
					</h3>
					<p className='text-sm text-muted-foreground'>
						Choose a conversation from the list to start messaging
					</p>
				</div>
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex-1 flex flex-col h-[calc(100vh-200px)] pt-12 pb-16 message-content",
				isMobile && !partnerId ? "hidden md:flex" : "flex"
			)}>
			{/* Header */}
			<div className='p-4 border-b top-12 z-10'>
				<div className='flex items-center gap-2'>
					{isMobile && partnerId && (
						<Button
							variant='ghost'
							size='icon'
							onClick={() => {
								router.push("/messages");
								// Show message list on mobile
								const messageList =
									document.querySelector(".message-list");
								if (messageList) {
									messageList.classList.remove("hidden");
								}
								// Hide message content on mobile
								const messageContent =
									document.querySelector(".message-content");
								if (messageContent) {
									messageContent.classList.add("hidden");
								}
							}}>
							<ArrowLeft className='h-5 w-5' />
						</Button>
					)}
					<Avatar>
						<AvatarImage src={partner?.avatar} />
						<AvatarFallback>
							{partner?.name?.slice(0, 2) || "?"}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-semibold'>{partner?.name}</p>
						<div className='flex items-center gap-2'>
							<p className='text-sm text-muted-foreground'>
								@{partner?.username}
							</p>
							<div className='flex items-center gap-1'>
								<div
									className={cn(
										"w-2 h-2 rounded-full",
										partner?.online
											? "bg-green-500"
											: "bg-gray-400"
									)}
								/>
								<span className='text-xs text-muted-foreground'>
									{partner?.online ? "Online" : "Offline"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Messages */}
			<div
				ref={messagesContainerRef}
				className='flex-1 px-4 flex flex-col justify-start'>
				{loading ? (
					<div className='flex items-center justify-center h-full'>
						<Loader2 className='w-6 h-6 animate-spin' />
					</div>
				) : messages.length === 0 ? (
					<div className='flex items-center justify-center h-full'>
						<p className='text-muted-foreground'>
							No messages yet. Start a conversation!
						</p>
					</div>
				) : (
					<div
						className='space-y-4 flex flex-col overflow-scroll h-[calc(100vh-260px)]'
						ref={messagesEndRef}>
						{messages.map((message) => (
							<div
								key={message._id}
								className={cn(
									"flex gap-2",
									message.senderId._id === session?.user?.id
										? "justify-end"
										: "justify-start"
								)}>
								{message.senderId._id !== session?.user?.id && (
									<Avatar className='w-6 h-6'>
										<AvatarImage
											src={message.senderId.avatar}
										/>
										<AvatarFallback>
											{message.senderId.name?.charAt(0) ||
												"?"}
										</AvatarFallback>
									</Avatar>
								)}
								<div
									className={cn(
										"rounded-lg p-2 max-w-[70%]",
										message.senderId._id ===
											session?.user?.id
											? "bg-primary text-primary-foreground"
											: "bg-muted"
									)}>
									<p className='text-sm'>{message.content}</p>
									<p
										className={cn(
											"text-[10px] mt-1",
											message.senderId._id ===
												session?.user?.id
												? "text-primary-foreground/70"
												: "text-muted-foreground"
										)}>
										{formatDistanceToNow(
											new Date(message.createdAt),
											{
												addSuffix: true,
											}
										)}
									</p>
								</div>
							</div>
						))}
						{isTyping && (
							<div className='flex justify-start'>
								<div className='max-w-[75%] rounded-lg bg-muted px-4 py-2 text-sm'>
									<p>Typing...</p>
								</div>
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			<div className='border-t p-4'>
				<div className='flex items-center gap-2'>
					<Button
						variant='ghost'
						size='icon'
						className='rounded-full'>
						<Paperclip className='h-5 w-5' />
					</Button>
					<Button
						variant='ghost'
						size='icon'
						className='rounded-full'>
						<ImageIcon className='h-5 w-5' />
					</Button>
					<div className='relative flex-1'>
						<Input
							value={messageText}
							onChange={(e) => setMessageText(e.target.value)}
							onFocus={() => handleTyping(true)}
							onBlur={() => handleTyping(false)}
							placeholder='Type a message...'
							className='pr-10'
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSend();
								}
							}}
						/>
						<Button
							variant='ghost'
							size='icon'
							className='absolute right-1 top-1/2 -translate-y-1/2 rounded-full'>
							<Smile className='h-5 w-5' />
						</Button>
					</div>
					<Button
						onClick={handleSend}
						disabled={!messageText.trim()}
						size='icon'
						className='rounded-full'>
						<Send className='h-5 w-5' />
					</Button>
				</div>
			</div>
		</div>
	);
}
