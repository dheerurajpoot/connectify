import type { Server as NetServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import type { NextApiRequest } from "next"
import type { NextApiResponse } from "next"
import { getSession } from "next-auth/react"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketIOServer
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  // Get the user from the session
  const session = await getSession({ req })

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  // Set up Socket.io if it's not already set up
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server)
    res.socket.server.io = io

    io.on("connection", (socket) => {
      // Join a room with the user's ID
      socket.on("join", (userId) => {
        socket.join(userId)
      })

      // Handle new messages
      socket.on("message", (message) => {
        // Emit to the receiver's room
        io.to(message.receiverId).emit("message", message)
      })

      // Handle typing indicators
      socket.on("typing", (data) => {
        io.to(data.receiverId).emit("typing", {
          senderId: data.senderId,
          isTyping: data.isTyping,
        })
      })

      // Handle notifications
      socket.on("notification", (notification) => {
        io.to(notification.userId).emit("notification", notification)
      })
    })
  }

  res.end()
}
