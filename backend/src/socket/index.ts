import type { Server } from "socket.io";
import { socketAuthMiddleware } from "../middlewares/socket.middleware";
import { SocketEvents } from "../constants/socket";
import { ApiError } from "../utils/ApiError";
import { SocketService } from "./socket.service";
import type { SocketPayload } from "../types/socketPayload";

let ioInstance: Server;
const initializeSocket = (io: Server) => {
  if (!io) {
    throw new ApiError(
      500,
      "Socket.io server instance is required to initialize socket.",
    );
  }

  io.use(socketAuthMiddleware);
  io.on(SocketEvents.CONNECT, (socket) => {
    // register event listeners here
    socket.on(SocketEvents.JOIN_ROOM, (conversationId) => {
      SocketService.joinRoom(socket, conversationId);
    });

    socket.on(SocketEvents.LEAVE_ROOM, (conversationId) => {
      SocketService.leaveRoom(socket, conversationId);
    });

    socket.on(SocketEvents.MESSAGE, (data: SocketPayload) => {
      SocketService.sendMessageToRoom(
        io,
        data.conversationId,
        SocketEvents.MESSAGE,
        data.message,
      );
    });

    socket.on(SocketEvents.TYPING, (userID, conversationId) => {
      SocketService.sendTypingStatus(
        io,
        userID,
        conversationId,
        SocketEvents.TYPING,
      );
    });

    socket.on(SocketEvents.STOP_TYPING, (userID, conversationId) => {
      SocketService.sendStopTypingStatus(
        io,
        userID,
        conversationId,
        SocketEvents.STOP_TYPING,
      );
    });

    socket.on(SocketEvents.DISCONNECT, () => {
      console.log("user disconnected");
    });
  });
  ioInstance = io;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new ApiError(500, "Socket.io server instance is not initialized.");
  }
  return ioInstance;
};

export default initializeSocket;
