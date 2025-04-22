// socket.ts
import { Server } from "socket.io";
import { joinQueue, getQueueRank } from "./redis/redisUtils";

const userSockets = new Map<string, any>(); // userKey -> socket

export function setupQueueSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join-queue", async ({ ticketId, userId }) => {
      try {
        await joinQueue(ticketId, userId); // 이 부분에서 에러가 날 가능성
        const key = `${ticketId}:${userId}`;
        userSockets.set(key, socket);
      } catch (err) {
        console.error("Error in join-queue:", err, userId);
        socket.emit("error", { message: "Something went wrong!" });
      }
    });

    socket.on("disconnect", () => {
      for (const [key, s] of userSockets) {
        if (s.id === socket.id) {
          userSockets.delete(key);
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
