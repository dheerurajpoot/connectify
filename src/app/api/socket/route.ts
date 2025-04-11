import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from "socket.io";
import { createServer } from "http";
import { NextResponse } from "next/server";

declare global {
  var io: ServerIO | undefined;
  var httpServer: any;
}

if (!global.io) {
  console.log("Setting up Socket.IO server...");

  if (!global.httpServer) {
    global.httpServer = createServer();
    global.httpServer.listen(3001, () => {
      console.log('Socket.IO server listening on port 3001');
    });
  }

  global.io = new ServerIO(global.httpServer, {
    path: "/api/socket/io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["polling"],
    connectTimeout: 10000,
    pingTimeout: 5000,
  });

  // Track online users
  const onlineUsers = new Map();

  global.io.on('connection', (socket) => {
    console.log('Client connected');
    let currentUserId: string;

    socket.on('join', (userId: string) => {
      currentUserId = userId;
      socket.join(userId);
      onlineUsers.set(userId, true);
      // Broadcast user's online status to all connected clients
      global.io?.emit('userStatus', { userId, online: true });
      console.log(`User ${userId} joined their room`);
    });

    socket.on("message", (message) => {
      global.io?.to(message.receiverId).emit("message", message);
    });

    socket.on("typing", (data: { senderId: string; receiverId: string; isTyping: boolean }) => {
      global.io?.to(data.receiverId).emit("typing", {
        senderId: data.senderId,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', () => {
      if (currentUserId) {
        onlineUsers.delete(currentUserId);
        // Broadcast user's offline status
        global.io?.emit('userStatus', { userId: currentUserId, online: false });
      }
      console.log('Client disconnected');
    });
  });
}

export async function GET(req: Request) {
  return new NextResponse("Socket.IO server is running", { status: 200 });
}
