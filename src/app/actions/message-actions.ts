"use server"

import { sendMessage, getConversation, getUserConversations, markMessagesAsRead, searchUsers } from "@/lib/db"
import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { IMessage } from "@/models"

export async function sendNewMessage(receiverId: string, content: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to send messages" }
    }

    // Validate input
    if (!content) {
      return { error: "Message cannot be empty" }
    }

    const message = await sendMessage({
      senderId: session.user.id,
      receiverId,
      content,
    } as any) // Using type assertion since the db function handles the ObjectId conversion

    revalidatePath("/messages")
    return { success: true, message }
  } catch (error) {
    console.error("Send message error:", error)
    return { error: "Failed to send message" }
  }
}

export async function getUserMessages(partnerId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to view messages" }
    }

    const messages = await getConversation(session.user.id, partnerId)

    // Mark messages as read
    await markMessagesAsRead(partnerId, session.user.id)

    // Convert MongoDB documents to plain objects
    const plainMessages = messages.map((msg: any) => ({
      _id: msg._id.toString(),
      senderId: {
        _id: msg.senderId._id.toString(),
        name: msg.senderId.name,
        username: msg.senderId.username,
        avatar: msg.senderId.avatar,
      },
      receiverId: {
        _id: msg.receiverId._id.toString(),
        name: msg.receiverId.name,
        username: msg.receiverId.username,
        avatar: msg.receiverId.avatar,
      },
      content: msg.content,
      read: msg.read,
      createdAt: new Date(msg.createdAt).toISOString(),
    }))

    return { success: true, messages: plainMessages }
  } catch (error) {
    console.error("Get messages error:", error)
    return { error: "Failed to get messages" }
  }
}

export async function getConversations() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to view conversations" }
    }

    const conversations = await getUserConversations(session.user.id)

    // Convert MongoDB documents to plain objects
    const plainConversations = conversations.map((conv: any) => ({
      user: {
        _id: conv.user._id.toString(),
        name: conv.user.name,
        username: conv.user.username,
        avatar: conv.user.avatar,
      },
      lastMessage: {
        content: conv.lastMessage.content,
        createdAt: new Date(conv.lastMessage.createdAt).toISOString(),
        read: conv.lastMessage.read,
      },
      unreadCount: conv.unreadCount,
    }))

    return { success: true, conversations: plainConversations }
  } catch (error) {
    console.error("Get conversations error:", error)
    return { error: "Failed to get conversations" }
  }
}

export async function searchUsersToMessage(query: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to search users" }
    }

    const users = await searchUsers(query, session.user.id)
    return { success: true, users }
  } catch (error) {
    console.error("Search users error:", error)
    return { error: "Failed to search users" }
  }
}
