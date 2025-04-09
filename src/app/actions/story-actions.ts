"use server"

import { createStory, getActiveStories, viewStory } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createNewStory(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to create a story" }
    }

    const mediaFile = formData.get("media") as File

    // Validate input
    if (!mediaFile) {
      return { error: "Story must have media" }
    }

    // In a real app, you would upload the media file to a storage service
    // and store the URL in the database
    const media = "/placeholder.svg?height=600&width=600"

    const story = await createStory({
      userId: session.user.id,
      media,
    })

    revalidatePath("/")
    return { success: true, story }
  } catch (error) {
    console.error("Create story error:", error)
    return { error: "Failed to create story" }
  }
}

export async function getStories() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to view stories" }
    }

    const stories = await getActiveStories(session.user.id)

    return { success: true, stories }
  } catch (error) {
    console.error("Get stories error:", error)
    return { error: "Failed to get stories" }
  }
}

export async function viewUserStory(storyId: string) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to view stories" }
    }

    await viewStory(storyId, session.user.id)

    return { success: true }
  } catch (error) {
    console.error("View story error:", error)
    return { error: "Failed to view story" }
  }
}
