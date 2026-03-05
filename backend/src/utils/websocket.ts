// socket.ts
import { Server } from "socket.io";
import {
  joinQueue,
  getQueueRank,
  cleanupQueue,
  getZrange,
} from "./redis/redisUtils";

const userSockets = new Map<string, any>(); // userKey -> socket
const queueTimers = new Map<string, NodeJS.Timeout>(); // ticketId -> setInterval timer

export function setupQueueSocket(io: Server) {
  io.on("connection", (socket) => {
    socket.on("join-queue", async ({ ticketId, userId }) => {
      try {
        await joinQueue(ticketId, userId); // 큐에 사용자 추가

        const key = `${ticketId}:${userId}`;
        userSockets.set(key, socket);

        // ticketId에 대해 setInterval이 이미 실행 중이 아니라면 새로 시작
        if (!queueTimers.has(ticketId)) {
          const timer = setInterval(async () => {
            try {
              const hasActiveUsers = Array.from(userSockets.keys()).some(
                (key) => key.startsWith(`${ticketId}:`),
              );
              if (!hasActiveUsers) {
                console.log(
                  `No active users for ticket ${ticketId}. Clearing queue and stopping timer.`,
                );
                const existingTimer = queueTimers.get(ticketId);
                if (existingTimer) {
                  clearInterval(existingTimer);
                }
                queueTimers.delete(ticketId);
                return;
              }
              if (process.env.NODE_APP_INSTANCE === "0")
                await cleanupQueue(ticketId);

              const activeUsers = await getZrange(ticketId, 0, -1);
              const rankMap = new Map<string, number>(
                activeUsers.map((userId, index) => [userId, index + 1]),
              );
              for (const [key, socket] of userSockets) {
                const [tId, userId] = key.split(":");
                if (tId !== ticketId) continue;
                const rank = rankMap.get(userId) || -1;
                if (rank === -1) {
                  socket.emit("queue-update", { rank: -1 });
                  userSockets.delete(key);
                } else {
                  socket.emit("queue-update", { rank });
                }
              }
            } catch (err) {
              console.error("Error in queue update interval:", err);
            }
          }, 10000);

          // 해당 ticketId에 대한 setInterval 타이머 저장
          queueTimers.set(ticketId, timer);
        }
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
}
