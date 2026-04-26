import type { Server, Socket } from "socket.io";
import type { SocketEvents } from "../constants/socket";

export class SocketService {
  static async joinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
  }

  static async leaveRoom(socket: Socket, roomId: string) {
    socket.leave(roomId);
  }

  static async sendMessageToRoom(
    io: Server,
    roomId: string,
    event: SocketEvents,
    data: any,
  ) {
    io.to(roomId).emit(event, data);
  }
}
