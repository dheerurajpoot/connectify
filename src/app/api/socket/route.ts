import { type NextRequest, NextResponse } from "next/server"
import type { Server as SocketIOServer } from "socket.io"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Store the Socket.io server instance
let io: SocketIOServer

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // This is a workaround for Next.js App Router
  // In a production app, you would use a more robust solution
  // like a separate WebSocket server or a service like Pusher

  return NextResponse.json({ ok: true })
}
