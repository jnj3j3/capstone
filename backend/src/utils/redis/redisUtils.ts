// queue.ts
import { redisClient } from "./redis";

const QUEUE_PREFIX = "ticket_queue:";

export const joinQueue = async (ticketId: string, userId: string) => {
  const client = await redisClient();
  const score = Date.now(); // timestamp로 정렬
  // 10분이 지난 데이터는 삭제
  await client.zRemRangeByScore(
    `ticket_queue:${ticketId}`,
    0,
    Date.now() - 10 * 60 * 1000
  );
  await client.zAdd(`ticket_queue:${ticketId}`, [{ score, value: userId }]);
};

export const getQueueRank = async (
  ticketId: string,
  userId: string
): Promise<number> => {
  const client = await redisClient();
  const rank = await client.zRank(`ticket_queue:${ticketId}`, userId);
  return rank !== null ? rank + 1 : -1;
};

export const isUserAllowed = async (
  ticketId: string,
  userId: string,
  maxRank: number = 10
): Promise<boolean> => {
  const rank = await getQueueRank(ticketId, userId);
  return rank > 0 && rank <= maxRank;
};
