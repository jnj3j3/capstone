// socket.ts
import { Server } from "socket.io";
import { joinQueue, getQueueRank } from "./redis/redisUtils";

const userSockets = new Map<string, any>(); // userKey -> socket

export function setupQueueSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("join-queue", async ({ ticketId, userId }) => {
      await joinQueue(ticketId, userId);
      const key = `${ticketId}:${userId}`;
      userSockets.set(key, socket);
    });

    socket.on("disconnect", () => {
      for (const [key, s] of userSockets) {
        if (s.id === socket.id) {
          userSockets.delete(key);
          console.log("User disconnected from queue");
          break;
        }
      }
    });
  });

  setInterval(async () => {
    for (const [key, socket] of userSockets) {
      const [ticketId, userId] = key.split(":");
      const rank = await getQueueRank(ticketId, userId);
      if (rank === -1) {
        socket.emit("queue-update", { rank: -1 });
        userSockets.delete(key);
      } else {
        socket.emit("queue-update", { rank });
      }
    }
  }, 3000);
}
