// queue.ts
import { redisClient } from "./redis";

const QUEUE_PREFIX = "ticket_queue:";

export const joinQueue = async (ticketId: string, userId: string) => {
  const client = await redisClient();
  const queueKey = `ticket_queue:${ticketId}`;
  const now = Date.now();
  // const expirationTime = now - 10 * 60 * 1000;

  // const luaScript = `
  //   redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, ARGV[1])
  //   redis.call('ZADD', KEYS[1], ARGV[2], ARGV[3])
  //   return 1
  // `;

  // await client.eval(luaScript, {
  //   keys: [queueKey],
  //   arguments: [expirationTime.toString(), now.toString(), userId],
  // });
  await client.zAdd(queueKey, { score: now, value: userId });
};

export const getQueueRank = async (
  ticketId: string,
  userId: string,
): Promise<number> => {
  const client = await redisClient();
  const rank = await client.zRank(`ticket_queue:${ticketId}`, userId);
  return rank !== null ? rank + 1 : -1;
};

export const isUserAllowed = async (
  ticketId: string,
  userId: string,
  maxRank: number = 10,
): Promise<boolean> => {
  const rank = await getQueueRank(ticketId, userId);
  return rank > 0 && rank <= maxRank;
};

export const cleanupQueue = async (ticketId: string) => {
  const client = await redisClient();
  const queueKey = `ticket_queue:${ticketId}`;
  const now = Date.now();
  const expirationTime = now - 10 * 60 * 1000;
  await client.zRemRangeByScore(queueKey, 0, expirationTime.toString());
};

export const getZrange = async (
  ticketId: string,
  start: number,
  stop: number,
) => {
  const client = await redisClient();
  return await client.zRange(`ticket_queue:${ticketId}`, start, stop);
};
