import { Server } from "socket.io";
import { joinQueue, getQueueRank } from "./redis/redisUtils";

const globalUserIntervals = new Map<string, NodeJS.Timeout>();
export function setupQueueSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("Client connected to queue system");

    socket.on("join-queue", async ({ ticketId, userId }) => {
      await joinQueue(ticketId, userId);
      const key = `${ticketId}:${userId}`;

      if (globalUserIntervals.has(key)) {
        clearInterval(globalUserIntervals.get(key));
      }

      const interval = setInterval(async () => {
        const rank = await getQueueRank(ticketId, userId);
        if (rank === -1) {
          console.log("User left the queue");
          socket.emit("queue-update", { rank: -1 });
          clearInterval(interval);
          globalUserIntervals.delete(key);
          return;
        }
        socket.emit("queue-update", { rank });
      }, 3000);

      globalUserIntervals.set(key, interval);

      socket.on("disconnect", () => {
        clearInterval(interval);
        globalUserIntervals.delete(key);
        console.log("Queue user disconnected");
      });
    });
  });
}
