import { Server } from "socket.io";
import { prisma } from "./prisma.js";
import { envVars } from "../config/env.js";
import { chatService } from "../module/chat/chat.service.js";
import { jwtUtils } from "../utils/jwt.js";
// Track online users: userId -> Set of socketIds
const onlineUsers = new Map();
export const initializeSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                envVars.FRONTEND_URL,
                "http://localhost:3000",
                "http://localhost:5000",
            ],
            credentials: true,
        },
    });
    // Auth middleware — try session token first, then accessToken JWT (same as checkAuth)
    io.use(async (socket, next) => {
        try {
            const cookieStr = socket.handshake.headers?.cookie || "";
            // --- Attempt 1: better-auth.session_token ---
            const sessionMatch = cookieStr.match(/better-auth\.session_token=([^;]+)/);
            if (sessionMatch?.[1]) {
                const sessionToken = decodeURIComponent(sessionMatch[1]);
                const session = await prisma.session.findFirst({
                    where: {
                        token: sessionToken,
                        expiresAt: { gt: new Date() },
                    },
                    include: { user: true },
                });
                if (session?.user) {
                    socket.userId = session.user.id;
                    return next();
                }
            }
            // --- Attempt 2: accessToken JWT (fallback for Google login users) ---
            const accessMatch = cookieStr.match(/accessToken=([^;]+)/);
            const accessToken = socket.handshake.auth?.token ||
                (accessMatch?.[1] ? decodeURIComponent(accessMatch[1]) : null);
            if (accessToken) {
                const verified = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
                if (verified.success && verified.data) {
                    socket.userId = verified.data.userId;
                    return next();
                }
            }
            return next(new Error("Authentication required"));
        }
        catch {
            next(new Error("Authentication failed"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.userId;
        console.log(`User ${userId} connected via socket ${socket.id}`);
        // Track online status
        if (!onlineUsers.has(userId)) {
            onlineUsers.set(userId, new Set());
        }
        onlineUsers.get(userId).add(socket.id);
        // --- Join conversation room ---
        socket.on("join-conversation", (conversationId) => {
            socket.join(`conversation:${conversationId}`);
            console.log(`User ${userId} joined room: conversation:${conversationId}`);
        });
        // --- Leave conversation room ---
        socket.on("leave-conversation", (conversationId) => {
            socket.leave(`conversation:${conversationId}`);
        });
        // --- Send message ---
        socket.on("send-message", async (data) => {
            try {
                const message = await chatService.sendMessage(data.conversationId, userId, data.content);
                const roomName = `conversation:${data.conversationId}`;
                const room = io.sockets.adapter.rooms.get(roomName);
                console.log(`Room ${roomName} members: ${room?.size || 0}`);
                // Emit to everyone in the conversation room (including sender)
                io.in(roomName).emit("new-message", message);
                // Also notify the other user if they're not in the room
                const conversation = await prisma.conversation.findUnique({
                    where: { id: data.conversationId },
                });
                if (conversation) {
                    const recipientId = conversation.userId === userId
                        ? conversation.organizerId
                        : conversation.userId;
                    const recipientSockets = onlineUsers.get(recipientId);
                    if (recipientSockets) {
                        recipientSockets.forEach((socketId) => {
                            io.to(socketId).emit("message-notification", {
                                conversationId: data.conversationId,
                                message,
                            });
                        });
                    }
                }
            }
            catch (error) {
                socket.emit("error", {
                    message: error instanceof Error ? error.message : "Failed to send message",
                });
            }
        });
        // --- Mark messages as read ---
        socket.on("mark-read", async (conversationId) => {
            try {
                await chatService.markMessagesAsRead(conversationId, userId);
                // Notify the other user that messages were read
                io.to(`conversation:${conversationId}`).emit("messages-read", {
                    conversationId,
                    readBy: userId,
                });
            }
            catch (error) {
                socket.emit("error", {
                    message: error instanceof Error
                        ? error.message
                        : "Failed to mark messages as read",
                });
            }
        });
        // --- Typing indicator (exclude sender — only other person sees it) ---
        socket.on("typing", (conversationId) => {
            socket.to(`conversation:${conversationId}`).emit("user-typing", {
                conversationId,
                userId,
            });
        });
        socket.on("stop-typing", (conversationId) => {
            socket.to(`conversation:${conversationId}`).emit("user-stop-typing", {
                conversationId,
                userId,
            });
        });
        // --- Check if user is online ---
        socket.on("check-online", (targetUserId) => {
            const isOnline = onlineUsers.has(targetUserId);
            socket.emit("user-online-status", {
                userId: targetUserId,
                isOnline,
            });
        });
        // --- Disconnect ---
        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected socket ${socket.id}`);
            const userSockets = onlineUsers.get(userId);
            if (userSockets) {
                userSockets.delete(socket.id);
                if (userSockets.size === 0) {
                    onlineUsers.delete(userId);
                }
            }
        });
    });
    return io;
};
//# sourceMappingURL=socket.js.map