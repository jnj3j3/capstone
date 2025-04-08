import { redisClient } from "./redis";

export async function setAsync(key: number, value: string): Promise<any> {
  const client = await redisClient();
  return client.set(key.toString(), value);
}

export async function getAsync(key: number): Promise<any> {
  const client = await redisClient();
  return client.get(key.toString());
}

export async function delAsync(key: number): Promise<any> {
  const client = await redisClient();
  return client.del(key.toString());
}
