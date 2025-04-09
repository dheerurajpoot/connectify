"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, ImageIcon, Smile, Paperclip, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { getUserMessages, sendNewMessage } from "@/app/actions/message-actions";
import { useSession } from "next-auth/react";
import { io, type Socket } from "socket.io-client";
import { useToast } from "../../hooks/use-toast";

interface Message {
	_id: string;
	senderId: string;
	receiverId: string;
	content: string;
	read: boolean;
	createdAt: string;
}

export function MessageContent() {
	const [messageText, setMessageText] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [loading, setLoading] = useState(true);
	const [partner, setPartner] = useState<any>(null);
	const [isTyping, setIsTyping] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();
	const partnerId = searchParams.get("id");
	const { toast } = useToast();
	const { data: session } = useSession();
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		if (partnerId && session?.user?.id) {
			fetchMessages();

			// Set up socket connection
			if (!socketRef.current) {
				socketRef.current = io("/api/socket");

				socketRef.current.on("connect", () => {
					console.log("Socket connected");
					socketRef.current?.emit("join", session.user.id);
				});

				socketRef.current.on("message", (message: Message) => {
					if (message.senderId === partnerId) {
						setMessages((prev) => [...prev, message]);
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
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [partnerId, session]);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
				setMessages(result.messages);

				// In a real app, you would also fetch the partner's user info
				setPartner({
					name: "Emma Wilson",
					username: "emma",
					avatar: "/placeholder.svg?height=40&width=40",
					online: true,
				});
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

		const newMessage = {
			_id: Date.now().toString(),
			senderId: session.user.id,
			receiverId: partnerId,
			content: messageText,
			read: false,
			createdAt: new Date().toISOString(),
		};

		// Optimistic update
		setMessages((prev) => [...prev, newMessage]);
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
				socketRef.current?.emit("message", newMessage);
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
		<div className='flex h-full flex-col'>
			<div className='flex items-center justify-between border-b p-4'>
				<div className='flex items-center gap-3'>
					<Avatar>
						<AvatarImage
							src={
								partner?.avatar ||
								"/placeholder.svg?height=40&width=40"
							}
							alt={partner?.name || "User"}
						/>
						<AvatarFallback>
							{partner?.name?.slice(0, 2) || "U"}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className='font-medium'>{partner?.name || "User"}</p>
						<p className='text-xs text-muted-foreground'>
							{partner?.online ? "Online" : "Offline"}
						</p>
					</div>
				</div>
				<Button variant='ghost' size='icon'>
					<MoreVertical className='h-5 w-5' />
				</Button>
			</div>

			<div className='flex-1 overflow-auto p-4'>
				{loading ? (
					<div className='flex h-full items-center justify-center'>
						<p>Loading messages...</p>
					</div>
				) : messages.length === 0 ? (
					<div className='flex h-full items-center justify-center'>
						<div className='text-center'>
							<h3 className='text-lg font-medium'>
								No messages yet
							</h3>
							<p className='text-sm text-muted-foreground'>
								Start the conversation by sending a message
							</p>
						</div>
					</div>
				) : (
					<div className='space-y-4'>
						{messages.map((message) => (
							<div
								key={message._id}
								className={cn(
									"flex",
									message.senderId === session?.user?.id
										? "justify-end"
										: "justify-start"
								)}>
								<div
									className={cn(
										"max-w-[75%] rounded-lg px-4 py-2 text-sm",
										message.senderId === session?.user?.id
											? "bg-primary text-primary-foreground"
											: "bg-muted"
									)}>
									<p>{message.content}</p>
									<p
										className={cn(
											"mt-1 text-right text-xs",
											message.senderId ===
												session?.user?.id
												? "text-primary-foreground/70"
												: "text-muted-foreground"
										)}>
										{new Date(
											message.createdAt
										).toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
										})}
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
