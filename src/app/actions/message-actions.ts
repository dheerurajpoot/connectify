"use server"

import { sendMessage, getConversation, getUserConversations, markMessagesAsRead } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

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
    })

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

    return { success: true, messages }
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

    return { success: true, conversations }
  } catch (error) {
    console.error("Get conversations error:", error)
    return { error: "Failed to get conversations" }
  }
}
