"use server"

import { updateUser, followUser, unfollowUser, getSuggestedUsers, searchUsers } from "@/lib/db"
import { createNotification } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateUserProfile(formData: FormData) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to update your profile" }
    }

    const name = formData.get("name") as string
    const bio = formData.get("bio") as string
    const location = formData.get("location") as string
    const website = formData.get("website") as string

    // In a real app, you would handle avatar upload to a storage service

    await updateUser(session.user.id, {
      name,
      bio,
      location,
      website,
    })

    revalidatePath(`/profile/${session.user.username}`)
    return { success: true }
  } catch (error) {
    console.error("Update profile error:", error)
    return { error: "Failed to update profile" }
  }
}

// export async function followUnfollowUser(targetUserId: string, isFollowing: boolean) {
//   try {
//     const session = await getServerSession(authOptions)

//     if (!session || !session.user) {
//       return { error: "You must be logged in to follow users" }
//     }

//     if (isFollowing) {
//       await unfollowUser(session.user.id, targetUserId)
//     } else {
//       await followUser(session.user.id, targetUserId)

//       // Create notification for the target user
//       await createNotification({
//         userId: targetUserId,
//         type: "follow",
//         actorId: session.user.id,
//       })
//     }

//     revalidatePath("/")
//     return { success: true }
//   } catch (error) {
//     console.error("Follow/unfollow user error:", error)
//     return { error: "Failed to follow/unfollow user" }
//   }
// }

export async function getSuggested() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return { error: "You must be logged in to get suggested users" }
    }

    const users = await getSuggestedUsers(session.user.id)

    return { success: true, users }
  } catch (error) {
    console.error("Get suggested users error:", error)
    return { error: "Failed to get suggested users" }
  }
}

export async function searchPeople(query: string) {
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
